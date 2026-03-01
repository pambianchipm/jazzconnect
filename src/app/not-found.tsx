import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-3xl font-bold text-gray-900">404</h1>
        <p className="mb-6 text-gray-500">
          Looks like this page went on a nature hike and got lost.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
