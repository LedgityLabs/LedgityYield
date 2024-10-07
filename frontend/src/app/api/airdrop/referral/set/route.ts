import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({
      success: false,
      entries: 0,
      error: "Twitter account not connected",
    });
  }

  // Retrieve body data
  const data = await request.json();
  const referrerId = data.referrerId;

  // Ensure the referrer is not the user
  if (referrerId === session.user.id) {
    return NextResponse.json({ success: false, error: "You can't refer yourself" });
  }

  // Ensure the referrer exists
  const referrerExists = await prisma.user.count({
    where: {
      id: referrerId,
    },
  });
  if (!referrerExists) {
    return NextResponse.json({ success: false, error: "Referrer doesn't exist" });
  }

  // Update the user referrer if not already set
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
        referrerId: null,
      },
      data: {
        referrerId: referrerId,
      },
    });
  } catch (error: any) {
    if (error.code !== "P2025") throw error;
  }

  // Return success
  return NextResponse.json({ success: true });
}
