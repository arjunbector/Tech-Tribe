import { getPlaiceholder } from "plaiceholder"
export async function getBase64(imageUrl: string) {
    try {
        const res = await fetch(imageUrl)
        if (!res.ok) {
            throw new Error("Failed to fetch image")
        }
        const buffer = await res.arrayBuffer();
        const { base64 } = await getPlaiceholder(Buffer.from(buffer));
        return base64;

    }
    catch (err) {
        console.log(err);
    }
}

export async function addBlurredDataUrls(images: string[]) {
    const base64Images = await Promise.all(images.map(async (image) => {
        return await getBase64(image);
    })
    )
    return base64Images;
}