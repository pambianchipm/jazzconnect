import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingUpdateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { status } = parsed.data;
  const bookingType = new URL(req.url).searchParams.get("type"); // "interest" | "invitation"

  if (bookingType === "interest") {
    // Venue accepts/declines band's interest
    const interest = await prisma.bandGigInterest.findUnique({
      where: { id: params.id },
      include: { gig: { include: { venue: true } } },
    });
    if (!interest || interest.gig.venue.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }
    const updated = await prisma.bandGigInterest.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ booking: updated });
  }

  if (bookingType === "invitation") {
    // Band admin accepts/declines a venue invitation
    const invitation = await prisma.bandInvitation.findUnique({
      where: { id: params.id },
      include: { band: { include: { members: true } } },
    });
    if (!invitation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const profile = await prisma.musicianProfile.findUnique({
      where: { userId: session.user.id },
    });
    const isAdmin = invitation.band.members.some(
      (m) => m.musicianId === profile?.id && m.isAdmin
    );
    if (!isAdmin) {
      return NextResponse.json({ error: "Only band admins can respond to invitations" }, { status: 403 });
    }

    const updated = await prisma.bandInvitation.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ booking: updated });
  }

  return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });
}
