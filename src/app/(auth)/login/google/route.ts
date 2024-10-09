import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"]
    });
    cookies().set("state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    cookies().set("codeVerifier", codeVerifier, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });
    return Response.redirect(url);
}