import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bandAvailabilitySchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const availability = await prisma.bandAvailability.findMany({
    where: { bandId: params.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ availability });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Musician profile not found" }, { status: 404 });
  }

  const membership = await prisma.bandMembership.findUnique({
    where: { bandId_musicianId: { bandId: params.id, musicianId: profile.id } },
  });
  if (!membership?.isAdmin) {
    return NextResponse.json({ error: "Only band admins can manage availability" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = bandAvailabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const slot = await prisma.bandAvailability.create({
    data: {
      bandId: params.id,
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Musician profile not found" }, { status: 404 });
  }

  const membership = await prisma.bandMembership.findUnique({
    where: { bandId_musicianId: { bandId: params.id, musicianId: profile.id } },
  });
  if (!membership?.isAdmin) {
    return NextResponse.json({ error: "Only band admins can manage availability" }, { status: 403 });
  }

  const { slotId } = await req.json();
  if (!slotId) return NextResponse.json({ error: "slotId required" }, { status: 400 });

  await prisma.bandAvailability.delete({ where: { id: slotId } });

  return NextResponse.json({ ok: true });
}
