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
      const data = parsed.data as { role: "musician"; bio: string; instruments: string; genres: string; instagram?: string; website?: string };
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "musician",
          onboarded: true,
          musicianProfile: {
            create: {
              bio: data.bio,
              instruments: data.instruments,
              genres: data.genres,
              instagram: data.instagram || "",
              website: data.website || "",
            },
          },
        },
      });
    } else {
      const data = parsed.data as { role: "venue"; venueName: string; description: string; address: string; venueType: string; capacity?: number; website?: string; phone?: string };
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: "venue",
          onboarded: true,
          venueProfile: {
            create: {
              name: data.venueName,
              description: data.description,
              address: data.address,
              venueType: data.venueType,
              capacity: data.capacity || 0,
              website: data.website || "",
              phone: data.phone || "",
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
