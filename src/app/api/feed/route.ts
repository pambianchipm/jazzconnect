import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1),
  type: z.enum(["update", "announcement", "winner", "photo"]).optional(),
  title: z.string().optional(),
  imageUrl: z.string().optional(),
  eventId: z.string().optional(),
});

export async function GET() {
  const posts = await prisma.feedPost.findMany({
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await prisma.feedPost.create({
    data: {
      authorId: session.user.id,
      content: parsed.data.content,
      type: parsed.data.type ?? "update",
      title: parsed.data.title ?? "",
      imageUrl: parsed.data.imageUrl ?? "",
      eventId: parsed.data.eventId ?? null,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
