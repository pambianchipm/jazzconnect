import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    include: {
      venue: { include: { user: true } },
      interests: {
        include: { musician: { include: { user: true } } },
      },
      invitations: {
        include: { musician: { include: { user: true } } },
      },
    },
  });

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  return NextResponse.json({ gig });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "venue") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    include: { venue: true },
  });

  if (!gig || gig.venue.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
  }

  const body = await req.json();

  // Allow status-only updates
  if (body.status && Object.keys(body).length === 1) {
    const updated = await prisma.gig.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return NextResponse.json({ gig: updated });
  }

  const parsed = gigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const updated = await prisma.gig.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });

  return NextResponse.json({ gig: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "venue") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    include: { venue: true },
  });

  if (!gig || gig.venue.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
  }

  await prisma.gig.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
