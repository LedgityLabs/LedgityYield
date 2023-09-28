import { env } from "../../../../../../../env.mjs";

export async function fetchZealyLeaderboard() {
  const data: Record<
    string,
    {
      xp: number;
      avatar: string;
    }
  > = {};

  let allPagesFetched = false;
  let currentPage = 0;
  while (!allPagesFetched) {
    // Retrieve current page data
    const res = await fetch(
      `https://api.zealy.io/communities/ledgityyield/leaderboard?limit=1000&page=${currentPage}`,
      {
        headers: {
          "x-api-key": env.ZEALY_API_KEY,
        },
        next: {
          revalidate: 60,
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
        // If the user has a connected twitter account
        if (member.twitterId) {
          data[member.twitterId] = {
            xp: member.xp,
            avatar: member.avatar,
          };
        }
      }
    }
  }

  return { lastUpdated: Date.now(), data };
}
