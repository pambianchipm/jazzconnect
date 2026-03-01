import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FeedList } from "@/components/FeedList";
import { CreatePostForm } from "@/components/CreatePostForm";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const posts = await prisma.feedPost.findMany({
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Family Feed</h1>
        <p className="mt-1 text-sm text-gray-500">
          Updates, announcements, and winner declarations
        </p>
      </div>

      <CreatePostForm />

      {posts.length === 0 ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            No posts yet. Be the first to share an update!
          </p>
        </div>
      ) : (
        <FeedList posts={posts} />
      )}
    </div>
  );
}
