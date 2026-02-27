import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bandSchema } from "@/lib/validations";

async function getAdminMusicianId(userId: string, bandId: string) {
  const profile = await prisma.musicianProfile.findUnique({ where: { userId } });
  if (!profile) return null;
  const membership = await prisma.bandMembership.findUnique({
    where: { bandId_musicianId: { bandId, musicianId: profile.id } },
  });
  return membership?.isAdmin ? profile.id : null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const band = await prisma.band.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: { musician: { include: { user: true } } },
        orderBy: { joinedAt: "asc" },
      },
      availability: { orderBy: { date: "asc" } },
    },
  });

  if (!band) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ band });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = await getAdminMusicianId(session.user.id, params.id);
  if (!adminId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = bandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const band = await prisma.band.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ band });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = await getAdminMusicianId(session.user.id, params.id);
  if (!adminId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.band.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
