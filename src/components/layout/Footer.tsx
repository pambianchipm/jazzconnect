import { Music } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-jazz-600" />
            <span className="text-sm font-semibold text-gray-900">JazzConnect NYC</span>
          </div>
          <div className="flex gap-6">
            <Link href="/musicians" className="text-sm text-gray-500 hover:text-gray-700">
              Musicians
            </Link>
            <Link href="/venues" className="text-sm text-gray-500 hover:text-gray-700">
              Venues
            </Link>
            <Link href="/gigs" className="text-sm text-gray-500 hover:text-gray-700">
              Gigs
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} JazzConnect NYC
          </p>
        </div>
      </div>
    </footer>
  );
}
