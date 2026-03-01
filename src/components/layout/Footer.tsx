import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-coral-500" />
            <span className="text-sm font-semibold text-gray-900">Family Reunion</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Family Reunion App
          </p>
        </div>
      </div>
    </footer>
  );
}
