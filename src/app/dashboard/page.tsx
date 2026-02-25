import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");
  if (!session.user.onboarded) redirect("/onboarding");

  if (session.user.role === "musician") {
    redirect("/dashboard/musician");
  } else {
    redirect("/dashboard/venue");
  }
}
