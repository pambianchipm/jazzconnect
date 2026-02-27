import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; musicianId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // Admins can remove anyone; members can only remove themselves
  const isSelf = actingProfile.id === params.musicianId;
  if (!actingMembership?.isAdmin && !isSelf) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.bandMembership.delete({
    where: {
      bandId_musicianId: { bandId: params.id, musicianId: params.musicianId },
    },
  });

  return NextResponse.json({ ok: true });
}
