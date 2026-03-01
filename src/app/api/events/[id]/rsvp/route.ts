import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const rsvpSchema = z.object({
  status: z.enum(["going", "maybe", "not-going"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rsvp = await prisma.rsvp.upsert({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId: params.id,
      },
    },
    update: { status: parsed.data.status },
    create: {
      userId: session.user.id,
      eventId: params.id,
      status: parsed.data.status,
    },
  });

  return NextResponse.json(rsvp);
}
