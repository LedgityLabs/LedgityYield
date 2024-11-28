import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export const GET = async () => {
    const session = await getServerSession(nextAuthOptions);

    // If not session return error
    if (!session) {
        return NextResponse.json({
            success: false,
            entries: 0,
            error: "Twitter account not connected",
        });
    }

    // Fetch user
    const user = await prisma.user.findFirst({
        where: {
            id: session.user.id,
        },
        select: {
            protectedDataAddress: true,
        }
    });
    if (!user || !user?.protectedDataAddress) {
        return NextResponse.json({ success: false, error: "User already has no protected data address" });
    }

    // Return success
    return NextResponse.json({ success: true, address: user.protectedDataAddress });
}