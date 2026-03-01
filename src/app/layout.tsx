import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Family Reunion — Stay Connected",
  description:
    "Your family reunion hub. View the schedule, join events, track winners, and stay in the loop with everyone.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Family Reunion",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c8754",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
