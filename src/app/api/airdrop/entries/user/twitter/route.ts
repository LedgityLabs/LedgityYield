import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

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

  // Retrieve user data
  const userData = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      totalTweetsEntries: true,
    },
  });

  // Return the user entries count
  return NextResponse.json({
    success: true,
    entries: userData ? userData.totalTweetsEntries : 0,
    lastUpdated: Date.now(),
  });
}
