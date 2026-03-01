import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(["meal", "game", "outing", "ceremony", "free-time", "general"]).optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isAllDay: z.boolean().optional(),
});

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      rsvps: { include: { user: { select: { id: true, name: true, image: true } } } },
      winners: { include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { place: "asc" } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      location: parsed.data.location ?? "",
      category: parsed.data.category ?? "general",
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      isAllDay: parsed.data.isAllDay ?? false,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
