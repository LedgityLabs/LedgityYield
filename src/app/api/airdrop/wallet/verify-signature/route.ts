import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nextAuthOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { isAddress, verifyMessage } from "viem";

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({ success: false, error: "Twitter account not connected" });
  }

  // Retrieve body data
  const data = await request.json();
  const walletAddress = data.walletAddress;
  const signature = data.signature;

  // Ensure the address is valid
  if (!walletAddress || !isAddress(walletAddress)) {
    return NextResponse.json({ success: false, error: "Invalid wallet address" });
  }

  // Ensure this wallet is not already used
  const userExists = await prisma.user.count({
    where: {
      walletAddress: walletAddress.toLowerCase(),
    },
  });
  if (userExists) {
    return NextResponse.json({ success: false, error: "Wallet address already used" });
  }

  // Ensure there is a signature
  if (!signature) {
    return NextResponse.json({ success: false, error: "Missing signature" });
  }

  // Retrieve the generated message
  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      generatedMessage: true,
    },
  });
  const generatedMessage = user!.generatedMessage;

  // Ensure there is a generated message
  if (!generatedMessage) {
    return NextResponse.json({ success: false, error: "No generated message" });
  }

  // Verify the signature
  const isSignatureValid = await verifyMessage({
    address: walletAddress,
    message: generatedMessage,
    signature,
  });

  // If the signature is valid
  if (isSignatureValid) {
    // Update the user's wallet address
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        walletAddress: walletAddress.toLowerCase(),
      },
    });

    // Return success
    return NextResponse.json({ success: true });
  }
  // Else return error
  else return NextResponse.json({ success: false, error: "Invalid signature" });
}
