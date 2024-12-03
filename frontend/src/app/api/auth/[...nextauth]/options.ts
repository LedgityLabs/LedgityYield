import TwitterProvider from "next-auth/providers/twitter";
import { env } from "../../../../../env.mjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { DefaultSession } from "next-auth";
import { isAddress } from "viem";
import NextAuth, { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      twitterId: string;
      walletAddress: string | null;
    } & DefaultSession["user"];
  }
}

export const nextAuthOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  theme: {
    logo: "/assets/logo/logoLight.svg",
    buttonText: "#e0e7ff",
    brandColor: "#6366f1",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        //@ts-ignore
        session.user.twitterId = user.twitterId;
        //@ts-ignore
        session.user.walletAddress = user.walletAddress;
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        await prisma.user.update({
          where: {
            id: message.user.id,
          },
          data: {
            twitterId: message.account?.providerAccountId,
          },
        });
      }
    },
  },
};
