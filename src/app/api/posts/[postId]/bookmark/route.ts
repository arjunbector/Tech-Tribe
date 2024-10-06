import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo, FollowerInfo, LikeInfo } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
    { params: { postId } }: { params: { postId: string } }
) {
    try {
        const { user: loggedInUser } = await validateRequest();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookmark = await prisma.bookMark.findUnique({
            where: {
                userId_postId: {
                    userId: loggedInUser.id,
                    postId
                }
            }
        })

        const data: BookmarkInfo = {
            isBookmarkedByUser: !!bookmark
        }
        return NextResponse.json(data, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest,
    { params: { postId } }: { params: { postId: string } }) {
    try {
        const { user: loggedInUser } = await validateRequest();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await prisma.bookMark.upsert({
            where: {
                userId_postId: {
                    postId: postId,
                    userId: loggedInUser.id
                }
            },
            create: {
                userId: loggedInUser.id,
                postId: postId
            },
            update: {}
        })
        return new Response();

    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest,
    { params: { postId } }: { params: { postId: string } }) {
    try {
        const { user: loggedInUser } = await validateRequest();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await prisma.bookMark.deleteMany({
            where: {
                userId: loggedInUser.id,
                postId: postId
            }
        })
        return new Response();
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}