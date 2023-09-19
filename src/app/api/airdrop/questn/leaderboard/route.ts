import { NextResponse } from "next/server";

// Revalidate every 5 minutes
export const revalidate = 60 * 5;

export async function GET() {
  const res = await fetch(
    "https://api.questn.com/community/members/?community_url=testme9581&page=1&count=1000000",
    {
      headers: {
        "ACCESS-TOKEN": "DUMMY TOKEN",
      },
    },
  );

  const rawData = await res.json();
  const data: Record<string, number> = {};
  for (const member of rawData.result.data) {
    data[member.user_info.user_address] = member.rp_value;
  }

  return NextResponse.json({ data, lastUpdated: Date.now() });
}
