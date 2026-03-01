"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function CreatePostForm() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("update");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type, title }),
      });
      if (res.ok) {
        setContent("");
        setTitle("");
        setType("update");
        setExpanded(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <Card
        className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
        onClick={() => setExpanded(true)}
      >
        <p className="text-sm text-gray-400">
          Share an update with the family...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-reunion-500 focus:outline-none focus:ring-1 focus:ring-reunion-500"
          >
            <option value="update">Update</option>
            <option value="announcement">Announcement</option>
            <option value="winner">Winner Declaration</option>
            <option value="photo">Photo</option>
          </select>
        </div>

        {(type === "announcement" || type === "winner") && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-reunion-500 focus:outline-none focus:ring-1 focus:ring-reunion-500"
          />
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening at the reunion?"
          rows={3}
          className="mb-3 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-reunion-500 focus:outline-none focus:ring-1 focus:ring-reunion-500"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setExpanded(false);
              setContent("");
              setTitle("");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            <Send className="mr-1 h-4 w-4" />
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
