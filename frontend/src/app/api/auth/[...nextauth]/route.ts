import NextAuth from "next-auth";
import { nextAuthOptions } from "./options";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
