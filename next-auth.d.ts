import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    image?: string | null;
    address?: string | null;
    bio?: string | null;
    phone?: string | null;
  }

  interface Session {
    user: User & DefaultSession["user"];
    expires: string;
    error: string;
  }
}