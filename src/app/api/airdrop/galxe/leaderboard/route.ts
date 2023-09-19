import { NextResponse } from "next/server";

// Revalidate every 5 minutes
export const revalidate = 60 * 5;

const query = `
    {
    space(alias: "ledgityyield") {
      loyaltyPointsRanks(first: 100000) {
        list {
          points
          address {
            address
          }
        }
      }
    }
  }
`;

export async function GET() {
  const res = await fetch("https://graphigo.prd.galaxy.eco/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const rawData = await res.json();
  const data: Record<string, number> = {};
  for (const member of rawData.data.space.loyaltyPointsRanks.list) {
    data[member.address.address] = member.points;
  }

  return NextResponse.json({ data, lastUpdated: Date.now() });
}
