import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { user } = await validateRequest();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;
        const token = streamServerClient.createToken(
            user.id,
            expirationTime,
            issuedAt
        )
        return NextResponse.json({ token }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}