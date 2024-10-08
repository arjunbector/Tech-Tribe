"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// @ts-ignore
import bcrypt from "bcrypt";
import streamServerClient from "@/lib/stream";

export async function signUp(
    credentials: SignUpValues
): Promise<{ error: string }> {
    try {
        const { username, email, password } = signUpSchema.parse(credentials);
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateIdFromEntropySize(10);
        const existingUsername = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        })
        if (existingUsername) {
            return {
                error: "Username is already taken"
            }
        }
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            }
        })
        if (existingEmail) {
            return {
                error: "Email is already registered"
            }
        }
        await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    id: userId,
                    username: username,
                    displayName: username,
                    email: email,
                    passwordHash: passwordHash
                }
            })
            await streamServerClient.upsertUser({
                id: userId,
                username,
                name: username
            })
        })



        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )
        return redirect("/");
    }
    catch (err) {
        if (isRedirectError(err)) throw err;
        console.log(err);
        return {
            error: "Something went wrong. Please try again later."
        }
    }
}