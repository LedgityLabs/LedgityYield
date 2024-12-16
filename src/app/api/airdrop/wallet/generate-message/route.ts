import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nextAuthOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({
      success: false,
      error: "Twitter account not connected",
    });
  }

  // Generate unique message
  const message = `I confirm that I am the owner of this wallet.\nTimestamp: ${Date.now()}`;

  // Set message to user
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      generatedMessage: message,
    },
  });

  // Return message
  return NextResponse.json({ message });
}
