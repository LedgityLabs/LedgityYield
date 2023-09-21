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
      // Loop through the members
      for (const member of rawData.leaderboard) {
        // If the address is a valid address, add it to the data
        if (member.address.startsWith("0x")) {
          // If the user already associated this address to another account
          if (Object.keys(data).includes(member.address)) {
            // Use the one with the most XP
            if (data[member.address] < member.xp) data[member.address] += member.xp;
          }

          // Else, just add it
          else data[member.address] = member.xp;
        }
      }
    }
  }

  return NextResponse.json({ data, lastUpdated: Date.now() });
}
