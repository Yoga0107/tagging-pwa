import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/drizzle";
import { masterPic } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const rows = await db
          .select()
          .from(masterPic)
          .where(eq(masterPic.email, credentials.email))
          .limit(1);

        if (rows.length === 0) return null;

        const user = rows[0];

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        return {
          id: user.uid,
          email: user.email!,
          departement: user.departement,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // v4 valid
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.departement = user.departement;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.departement = token.departement as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
