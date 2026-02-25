import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const instrument = searchParams.get("instrument");
  const available = searchParams.get("available");

  const where: any = {};
  if (genre) where.genres = { contains: genre };
  if (instrument) where.instruments = { contains: instrument };
  if (available === "true") where.available = true;

  const musicians = await prisma.musicianProfile.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ musicians });
}
