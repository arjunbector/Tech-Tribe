import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH() {
    try {
        const { user } = await validateRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.notification.updateMany({
            where: {
                recipientId: user.id,
                read: false
            },
            data: {
                read: true
            }
        })
        return NextResponse.json({ success: true }, { status: 200 });

    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}