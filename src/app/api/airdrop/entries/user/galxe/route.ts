import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchGalxeLeaderboard } from "../../leaderboards/fetchGalxeLeaderboard";

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

  // Ensure the user has linked a wallet
  if (!session.user.walletAddress) {
    return NextResponse.json({ success: false, entries: 0, error: "No wallet linked" });
  }

  // Retrieve Galxe leaderboard
  const galxeLeaderboard = await fetchGalxeLeaderboard();

  // Retrieve user's Galxe loyalty points in the leaderboard
  const galxeLoyaltyPoints = galxeLeaderboard.data[session.user.walletAddress];

  // Return the user entries count
  return NextResponse.json({
    success: true,
    entries: galxeLoyaltyPoints ? galxeLoyaltyPoints : 0,
    lastUpdated: Date.now(),
  });
}
