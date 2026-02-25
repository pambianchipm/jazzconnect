import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { musicianProfileSchema, venueProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      musicianProfile: true,
      venueProfile: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    if (session.user.role === "musician") {
      const parsed = musicianProfileSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", issues: parsed.error.issues },
          { status: 400 }
        );
      }

      await prisma.musicianProfile.update({
        where: { userId: session.user.id },
        data: parsed.data,
      });
    } else if (session.user.role === "venue") {
      const parsed = venueProfileSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", issues: parsed.error.issues },
          { status: 400 }
        );
      }

      await prisma.venueProfile.update({
        where: { userId: session.user.id },
        data: parsed.data,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
