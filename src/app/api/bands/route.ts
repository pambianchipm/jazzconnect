import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bandSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const name = searchParams.get("name");

  const where: any = {};
  if (genre) where.genres = { contains: genre };
  if (name) where.name = { contains: name };

  const bands = await prisma.band.findMany({
    where,
    include: {
      members: {
        include: { musician: { include: { user: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bands });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "musician") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const musicianProfile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!musicianProfile) {
    return NextResponse.json({ error: "Musician profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = bandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const band = await prisma.band.create({
    data: {
      ...parsed.data,
      members: {
        create: {
          musicianId: musicianProfile.id,
          isAdmin: true,
        },
      },
    },
    include: {
      members: { include: { musician: { include: { user: true } } } },
    },
  });

  return NextResponse.json({ band }, { status: 201 });
}
