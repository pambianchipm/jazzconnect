import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only an admin member may add others
  const actingProfile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!actingProfile) {
    return NextResponse.json({ error: "Musician profile not found" }, { status: 404 });
  }

  const actingMembership = await prisma.bandMembership.findUnique({
    where: {
      bandId_musicianId: { bandId: params.id, musicianId: actingProfile.id },
    },
  });
  if (!actingMembership?.isAdmin) {
    return NextResponse.json({ error: "Only band admins can add members" }, { status: 403 });
  }

  const { musicianId } = await req.json();
  if (!musicianId) {
    return NextResponse.json({ error: "musicianId required" }, { status: 400 });
  }

  const targetProfile = await prisma.musicianProfile.findUnique({
    where: { id: musicianId },
  });
  if (!targetProfile) {
    return NextResponse.json({ error: "Musician not found" }, { status: 404 });
  }

  const existing = await prisma.bandMembership.findUnique({
    where: { bandId_musicianId: { bandId: params.id, musicianId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already a member" }, { status: 409 });
  }

  const membership = await prisma.bandMembership.create({
    data: { bandId: params.id, musicianId, isAdmin: false },
    include: { musician: { include: { user: true } } },
  });

  return NextResponse.json({ membership }, { status: 201 });
}
