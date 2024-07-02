import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export const POST = async (request: NextRequest) => {
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
    const protectedDataAddress = data.protectedDataAddress;

    // Ensure user has no protected data address registered
    const userExists = await prisma.user.count({
        where: {
            id: session.user.id,
            protectedDataAddress: null
        },
    });
    if (!userExists) {
        return NextResponse.json({ success: false, error: "User already has protected data address" });
    }

    // Ensure there is a protectedDataAddress
    if (!protectedDataAddress) {
        return NextResponse.json({ success: false, error: "Missing protected data address" });
    }

    // Update the user's protectedDataAddress
    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            protectedDataAddress
        },
    });

    // Return success
    return NextResponse.json({ success: true });
}