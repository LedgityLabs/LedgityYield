import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { redis } from "@/lib/db";

// Revalidate every minute
export const revalidate = 60;

export async function GET() {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({
      success: false,
      entries: 0,
      error: "Twitter account not connected",
    });
  }

  // Retrieve user points data
  const points = await redis.hgetall(`user:${session.user.id}`);

  // Format points data
  const twitterUsername = points.twitterUsername || "You";
  const image = points.image || "";
  const league = points.league || "unranked";
  const zealyPoints = points.zealyPoints ? parseInt(points.zealyPoints) : 0;
  const galxePoints = points.galxePoints ? parseInt(points.galxePoints) : 0;
  const preMiningPoints = points.preMiningPoints ? parseInt(points.preMiningPoints) : 0;
  const twitterPoints = points.twitterPoints ? parseInt(points.twitterPoints) : 0;
  const totalPoints = points.totalPoints ? parseInt(points.totalPoints) : 0;

  // Retrieve user rank in its league
  let rank: number | null = null;
  if (league !== "unranked") {
    const rawRank = await redis.zrevrank(points.league, session.user.id);
    rank = rawRank !== null ? rawRank + 1 : null;
  }

  // Return the user points data
  return NextResponse.json({
    success: true,
    twitterUsername,
    image,
    league,
    rank,
    zealyPoints,
    galxePoints,
    preMiningPoints,
    twitterPoints,
    totalPoints,
    lastUpdated: Date.now(),
  });
}
