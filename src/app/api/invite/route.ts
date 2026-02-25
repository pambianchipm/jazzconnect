import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "venue") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = invitationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Verify venue owns the gig
  const gig = await prisma.gig.findUnique({
    where: { id: parsed.data.gigId },
    include: { venue: true },
  });

  if (!gig || gig.venue.userId !== session.user.id) {
    return NextResponse.json({ error: "Gig not found or not authorized" }, { status: 404 });
  }

  // Verify musician exists
  const musician = await prisma.musicianProfile.findUnique({
    where: { id: parsed.data.musicianId },
  });

  if (!musician) {
    return NextResponse.json({ error: "Musician not found" }, { status: 404 });
  }

  // Check for existing invitation
  const existing = await prisma.invitation.findUnique({
    where: {
      gigId_musicianId: {
        gigId: parsed.data.gigId,
        musicianId: parsed.data.musicianId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already invited" },
      { status: 409 }
    );
  }

  const invitation = await prisma.invitation.create({
    data: {
      gigId: parsed.data.gigId,
      musicianId: parsed.data.musicianId,
      message: parsed.data.message || "",
    },
  });

  return NextResponse.json({ invitation }, { status: 201 });
}
