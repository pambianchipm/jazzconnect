import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const instrument = searchParams.get("instrument");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const status = searchParams.get("status") || "open";

  const where: any = {};
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }
  if (genre) where.genres = { contains: genre };
  if (instrument) where.instruments = { contains: instrument };

  const gigs = await prisma.gig.findMany({
    where,
    include: {
      venue: { include: { user: true } },
      _count: { select: { interests: true } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ gigs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "venue") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = gigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const venueProfile = await prisma.venueProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!venueProfile) {
    return NextResponse.json({ error: "Venue profile not found" }, { status: 404 });
  }

  const gig = await prisma.gig.create({
    data: {
      venueId: venueProfile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      genres: parsed.data.genres,
      instruments: parsed.data.instruments,
      payMin: parsed.data.payMin,
      payMax: parsed.data.payMax,
    },
  });

  return NextResponse.json({ gig }, { status: 201 });
}
