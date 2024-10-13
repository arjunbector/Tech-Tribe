import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany({
            select: {
                username: true,
            }
        })
        return NextResponse.json({ users }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}