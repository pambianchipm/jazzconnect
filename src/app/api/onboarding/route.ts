import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { role } = parsed.data;

  try {
    if (role === "musician") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "musician",
          onboarded: true,
          musicianProfile: {
            create: {
              bio: parsed.data.bio || "",
              instruments: parsed.data.instruments || "",
              genres: parsed.data.genres || "",
            },
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "venue",
          onboarded: true,
          venueProfile: {
            create: {
              name: parsed.data.venueName || "",
              description: parsed.data.description || "",
              address: parsed.data.address || "",
              venueType: parsed.data.venueType || "",
              capacity: parsed.data.capacity || 0,
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
