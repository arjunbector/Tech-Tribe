import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo, LikeInfo } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
    { params: { postId } }: { params: { postId: string } }
) {
    try {
        const { user: loggedInUser } = await validateRequest();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                likes: {
                    where: {
                        userId: loggedInUser.id
                    },
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        })
        if (!post)
            return NextResponse.json({ error: "Post not found" }, { status: 404 });

        const data: LikeInfo = {
            likes: post._count.likes,
            isLikedByUser: !!post.likes.length
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
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                userId: true
            }
        })
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        await prisma.$transaction([prisma.like.upsert({
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
        }), ...(loggedInUser.id !== post.userId ? [prisma.notification.create({
            data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE"
            }
        })] : [])])
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
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                userId: true
            }
        })
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        await prisma.$transaction([
            prisma.like.deleteMany({
                where: {
                    userId: loggedInUser.id,
                    postId: postId
                }
            }),
            prisma.notification.deleteMany({
                where: {
                    issuerId: loggedInUser.id,
                    recipientId: post.userId,
                    postId,
                    type: "LIKE"
                }
            })
        ])
        return new Response();
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}