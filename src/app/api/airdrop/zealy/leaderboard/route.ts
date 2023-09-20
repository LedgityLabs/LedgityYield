import { NextResponse } from "next/server";
import { env } from "../../../../../../env.mjs";

// Revalidate every minute
export const revalidate = 60 * 1;

export async function GET() {
  const data: Record<string, number> = {};

  let allPagesFetched = false;
  let currentPage = 0;
  while (!allPagesFetched) {
    console.log(currentPage);
    // Retrieve current page data
    const res = await fetch(
      `https://api.zealy.io/communities/ledgityyield/leaderboard?limit=10000&page=${currentPage}`,
      {
        headers: {
          "x-api-key": env.ZEALY_API_KEY,
        },
      },
    );
    const rawData = await res.json();

    // If this is the last page, set the flag
    if (rawData.totalPages === rawData.page) allPagesFetched = true;
    else currentPage++;

    // Format the data
    if (rawData.leaderboard) {
      for (const member of rawData.leaderboard) {
        if (member.address.startsWith("0x")) data[member.address] = member.xp;
      }
    }
  }

  return NextResponse.json({ data, lastUpdated: Date.now() });
}
