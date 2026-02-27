import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bandInterestSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "musician") {
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
    return NextResponse.json(
      { error: "Only band admins can express interest on behalf of the band" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = bandInterestSchema.safeParse({ ...body, bandId: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const gig = await prisma.gig.findUnique({ where: { id: parsed.data.gigId } });
  if (!gig || gig.status !== "open") {
    return NextResponse.json({ error: "Gig not found or not open" }, { status: 404 });
  }

  const existing = await prisma.bandGigInterest.findUnique({
    where: { bandId_gigId: { bandId: params.id, gigId: parsed.data.gigId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already expressed interest" }, { status: 409 });
  }

  const interest = await prisma.bandGigInterest.create({
    data: {
      bandId: params.id,
      gigId: parsed.data.gigId,
      message: parsed.data.message || "",
    },
  });

  return NextResponse.json({ interest }, { status: 201 });
}
