import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { interestSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "musician") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = interestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const musicianProfile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!musicianProfile) {
    return NextResponse.json({ error: "Musician profile not found" }, { status: 404 });
  }

  // Check gig exists and is open
  const gig = await prisma.gig.findUnique({
    where: { id: parsed.data.gigId },
  });

  if (!gig || gig.status !== "open") {
    return NextResponse.json({ error: "Gig not found or not open" }, { status: 404 });
  }

  // Check for existing interest
  const existing = await prisma.gigInterest.findUnique({
    where: {
      gigId_musicianId: {
        gigId: parsed.data.gigId,
        musicianId: musicianProfile.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already expressed interest" },
      { status: 409 }
    );
  }

  const interest = await prisma.gigInterest.create({
    data: {
      gigId: parsed.data.gigId,
      musicianId: musicianProfile.id,
      message: parsed.data.message || "",
    },
  });

  return NextResponse.json({ interest }, { status: 201 });
}
