import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    departement: string | null;
    CC: boolean | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      departement: string | null;
      CC: boolean | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    departement: string | null;
    CC: boolean | null;
  }
}
