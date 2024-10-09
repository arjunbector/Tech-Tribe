import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { user } = await validateRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const unreadCount = await prisma.notification.count({
            where: {
                recipientId: user.id,
                read: false
            }
        })
        const data: NotificationCountInfo = {
            unreadCount
        }
        return NextResponse.json(data, { status: 200 });
    }

    catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}