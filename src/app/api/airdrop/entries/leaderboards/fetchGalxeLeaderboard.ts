import { env } from "../../../../../../env.mjs";

const buildQuery = (nextCursor: string) => {
  const after = nextCursor !== "" ? `after: "${nextCursor}"` : "";
  return `
{
  space(id: 30261) {
    loyaltyPointsRanks(
      first: 1000
      ${after}
      order: GalxeID
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      list {
        points
        address {
          avatar
          address
        }
      }
    }
  }
}
  `;
};

export async function fetchGalxeLeaderboard() {
  const data: Record<string, number> = {};

  let nextCursor = "";
  let hasNextPage = true;
  while (hasNextPage) {
    // Retrieve page raw data
    const res = await fetch("https://graphigo.prd.galaxy.eco/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: env.GALXE_AUTHORIZATION_TOKEN,
      },
      body: JSON.stringify({ query: buildQuery(nextCursor) }),
      next: {
        revalidate: 60,
      },
    });
    const rawData = await res.json();

    // Upgrade count and check if there is a next page
    nextCursor = rawData.data.space.loyaltyPointsRanks.pageInfo.endCursor;
    hasNextPage = rawData.data.space.loyaltyPointsRanks.pageInfo.hasNextPage;

    // Format members in expected format
    for (const member of rawData.data.space.loyaltyPointsRanks.list) {
      data[member.address.address.toLowerCase()] = member.points;
    }
  }

  return { lastUpdated: Date.now(), data };
}
