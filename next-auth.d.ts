import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    image?: string | null;
    avatar?: string | null;
    location?: string | null;
    bio?: string | null;
    profile_id?: string | null;
    platform?: string | null;
    url?: string | null;
    social?: Socials;
  }

  // interface Profile {
  //   avatar?: string | null;
  //   location?: string | null;
  //   bio?: string | null;
  //   social : Socials;
  // }

  interface Socials {
    profile_id?: string | null;
    platform?: string | null;
    url?: string | null;
  }

  interface Session {
    user: User & DefaultSession["user"];
    expires: string;
    error: string;
  }
}
