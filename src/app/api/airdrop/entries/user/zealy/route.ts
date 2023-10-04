import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchZealyLeaderboard } from "../../leaderboards/fetchZealyLeaderboard";

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

  // Retrieve Zealy leaderboard
  const zealyLeaderboard = await fetchZealyLeaderboard();

  // Try finding the user in the leaderboard
  const user = zealyLeaderboard.data[session.user.twitterId];

  // Return the user entries count
  return NextResponse.json({
    success: true,
    entries: user ? user.xp : 0,
    lastUpdated: Date.now(),
  });
}
