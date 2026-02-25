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
  const bookingType = new URL(req.url).searchParams.get("type"); // "interest" or "invitation"

  if (bookingType === "interest") {
    // Venue accepts/declines a musician's interest
    const interest = await prisma.gigInterest.findUnique({
      where: { id: params.id },
      include: { gig: { include: { venue: true } } },
    });

    if (!interest || interest.gig.venue.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    const updated = await prisma.gigInterest.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ booking: updated });
  }

  if (bookingType === "invitation") {
    // Musician accepts/declines a venue's invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: { musician: true },
    });

    if (!invitation || invitation.musician.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ booking: updated });
  }

  return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });
}
