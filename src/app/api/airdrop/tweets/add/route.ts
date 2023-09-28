import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nextAuthOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { isAddress, verifyMessage } from "viem";

const isTweetURL = (url: string) => {
  const regex = /^(https?:\/\/(twitter\.com|x\.com))(?:\/[a-zA-Z0-9_]+)\/status\/(\d+)(?:\?.*)?$/;
  return regex.test(url);
};

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({ success: false, error: "Twitter account not connected" });
  }

  // Ensure tweet belongs to the user

  // Ensure tweet respect minimum requirements

  // Retrieve body data
  const data = await request.json();
  const tweetURL = data.tweetURL;

  // Ensure the address is valid
  if (!tweetURL || !isTweetURL(tweetURL)) {
    return NextResponse.json({ success: false, error: "Invalid tweet URL" });
  }

  // Retrieve the tweet ID
  let tweetId = tweetURL.split("?")[0];
  if (tweetId.endsWith("/")) tweetId = tweetId.slice(0, -1);
  tweetId = tweetId.split("/").pop();

  // Create the tweet in DB if not exists
  await prisma.tweet.upsert({
    where: {
      tweetId: tweetId,
    },
    update: {},
    create: {
      tweetId: tweetId,
      authorId: session.user.id,
    },
  });

  // Return success
  return NextResponse.json({ success: true });
}
