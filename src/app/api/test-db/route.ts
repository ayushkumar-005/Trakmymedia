import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Try to query the database
        // This counts how many users exist
        const userCount = await prisma.user.count();

        // Also test MediaItem
        const mediaCount = await prisma.mediaItem.count();

        return NextResponse.json({
            success: true,
            message: "Database connection successful!",
            data: {
                users: userCount,
                mediaItems: mediaCount,
            },
        });
    } catch (error) {
        // If something goes wrong, return error details
        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
