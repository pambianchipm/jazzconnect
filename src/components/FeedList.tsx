"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Pin, Megaphone, Trophy, Camera, MessageCircle } from "lucide-react";

interface FeedPostData {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string;
  pinned: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

function getTypeIcon(type: string) {
  switch (type) {
    case "announcement":
      return <Megaphone className="h-4 w-4 text-coral-500" />;
    case "winner":
      return <Trophy className="h-4 w-4 text-warmth-500" />;
    case "photo":
      return <Camera className="h-4 w-4 text-blue-500" />;
    default:
      return <MessageCircle className="h-4 w-4 text-reunion-500" />;
  }
}

function getTypeBadgeVariant(type: string) {
  switch (type) {
    case "announcement":
      return "coral" as const;
    case "winner":
      return "warmth" as const;
    default:
      return "reunion" as const;
  }
}

export function FeedList({ posts }: { posts: FeedPostData[] }) {
  return (
    <div className="mt-6 space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-5">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={post.author.image}
                name={post.author.name}
                size="md"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.pinned && (
                <Pin className="h-4 w-4 text-reunion-500" />
              )}
              <Badge variant={getTypeBadgeVariant(post.type)}>
                <span className="mr-1 inline-flex">{getTypeIcon(post.type)}</span>
                {post.type}
              </Badge>
            </div>
          </div>

          {/* Content */}
          {post.title && (
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {post.title}
            </h3>
          )}
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {post.content}
          </p>
        </Card>
      ))}
    </div>
  );
}
