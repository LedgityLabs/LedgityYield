import { redis } from "@/lib/db";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const revalidate = 60 * 5;

const validLeagues = ["bronze", "silver", "gold", "elite", "ruby", "titan", "legend", "secret"];

export async function GET(request: NextRequest) {
  // Extract search params
  const searchParams = request.nextUrl.searchParams;
  const league = searchParams.get("league");
  // const page = searchParams.get("page");

  // Validate league
  if (!league || !validLeagues.includes(league)) {
    return NextResponse.json({
      success: false,
      error: "Missing or invalid league",
    });
  }

  // Validate page
  // if (!page || isNaN(parseInt(page))) {
  //   return NextResponse.json({
  //     success: false,
  //     error: "Page must be a number",
  //   });
  // }

  // Compute leaderboard range
  // const pageSize = 100;
  // const start = (parseInt(page) - 1) * pageSize;
  // const end = start + pageSize - 1;

  // Retrieve leaderboard user ids
  // const pageUserIds = await redis.zrevrange(league, start, end);
  const pageUserIds = await redis.zrevrange(league, 0, 1000);

  // Retrieve user data
  const pipeline = redis.pipeline();
  pageUserIds.forEach((userId) => pipeline.hgetall(`user:${userId}`));
  const pageUserRes = await pipeline.exec();

  // Ensure pipeline returned data
  if (!pageUserRes) {
    return NextResponse.json({
      success: false,
      error: "Failed to retrieve user data",
    });
  }

  // Format leaderboard data
  const leaderboardData = pageUserRes.map((res) => {
    const userData = res[1] as Record<string, string>;
    const totalPoints = userData.totalPoints ? parseInt(userData.totalPoints) : 0;

    return {
      twitterUsername: userData.twitterUsername,
      image: userData.image,
      totalPoints,
    };
  });

  return NextResponse.json({
    success: true,
    data: leaderboardData,
    lastUpdated: Date.now(),
  });
}
