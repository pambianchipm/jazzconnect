import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      familyName: string | null;
      nickname: string | null;
    } & DefaultSession["user"];
  }
}
