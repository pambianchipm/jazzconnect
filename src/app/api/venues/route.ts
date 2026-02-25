import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const venueType = searchParams.get("venueType");

  const where: any = {};
  if (venueType) where.venueType = venueType;

  const venues = await prisma.venueProfile.findMany({
    where,
    include: {
      user: true,
      _count: { select: { gigs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ venues });
}
