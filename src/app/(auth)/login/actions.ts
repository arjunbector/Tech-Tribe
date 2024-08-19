"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import bcrypt from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(
    credentials: LoginValues
): Promise<{ error: string }> {
    try {
        const { username, password } = loginSchema.parse(credentials);
        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        })
        if (!existingUser || !existingUser.passwordHash) {
            return {
                error: "Invalid username or password"
            }
        }

        // const validePassword = await verify(existingUser.passwordHash, password, {
        //     memoryCost: 19456,
        //     timeCost: 2,
        //     outputLen: 32,
        //     parallelism: 2,
        // });

        const validePassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (!validePassword) {
            return {
                error: "Invalid username or password"
            }
        }

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )
        return redirect("/")
    }
    catch (err) {
        if (isRedirectError(err)) throw err;
        console.log(err);
        return { error: "An error occurred" };
    }
}