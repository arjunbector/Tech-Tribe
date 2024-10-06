import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        if (authHeader != `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json(
                { message: "Invalid authorization error" },
                { status: 401 }
            )
        }
        const unUsedMedia = await prisma.media.findMany({
            where: {
                postId: null,
                ...(process.env.NODE_ENV === "production")
                    ? {
                        createdAt: {
                            lte: new Date(Date.now() - 1000 * 60 * 60 * 24)
                        }
                    } : {}
            }
        })
        new UTApi().deleteFiles(
            unUsedMedia.map(m => m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1])
        )

        await prisma.media.deleteMany({
            where: {
                id: {
                    in: unUsedMedia.map(m => m.id)
                }
            }
        })
        return Response.json({ message: "Deleted files" }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}