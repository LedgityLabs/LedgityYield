import { prisma } from "@/lib/db";

export async function fetchGalxeLeaderboard() {
  const data: Record<string, number> = {};

  await prisma.user.findMany({
    where: {
      ingested: true,
    },
    select: {
      twitterUsername: true,
      twitterId: true,
      image: true,
      walletAddress: true,
      totalTweetsEntries: true,
    },
  });

  return { lastUpdated: Date.now(), data };
}
