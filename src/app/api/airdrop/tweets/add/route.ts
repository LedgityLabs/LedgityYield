import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nextAuthOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

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

  // Retrieve body data
  const data = await request.json();
  const rawTweetURL = data.tweetURL;

  // Ensure the address is valid
  if (!rawTweetURL || !isTweetURL(rawTweetURL)) {
    return NextResponse.json({ success: false, error: "Invalid tweet URL" });
  }

  // Retrieve the tweet ID
  let tweetURL = rawTweetURL.trim().split("?")[0].trim();
  if (tweetURL.endsWith("/")) tweetURL = tweetURL.slice(0, -1);
  const tweetId = tweetURL.split("/").pop();

  // Ensure tweet has not already been submitted
  const alreadySubmitted = await prisma.tweet.count({
    where: {
      id: tweetId,
      authorId: session.user.id,
    },
  });
  if (alreadySubmitted) {
    return NextResponse.json({ success: false, error: "Tweet already submitted" });
  }

  // Else Create the tweet in DB if not exists
  await prisma.tweet.create({
    data: {
      id: tweetId,
      authorId: session.user.id,
      url: tweetURL,
    },
  });

  // Return success
  return NextResponse.json({
    success: true,
    data: {
      id: tweetId,
      url: tweetURL,
    },
  });
}
