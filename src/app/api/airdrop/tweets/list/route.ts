import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Revalidate every minute
export const revalidate = 60 * 5;

export async function GET(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({
      success: false,
      error: "Twitter account not connected",
    });
  }

  // Retrieve user tweets
  const tweets = await prisma.tweet.findMany({
    where: {
      authorId: session.user.id,
    },
    select: {
      id: true,
      url: true,
      date: true,
      content: true,
      likes: true,
      retweets: true,
      quotes: true,
      replies: true,
      entries: true,
      ingested: true,
      rejected: true,
      rejectionReason: true,
    },
  });

  // Return the user entries count
  return NextResponse.json({ data: tweets, lastUpdated: Date.now() });
}
