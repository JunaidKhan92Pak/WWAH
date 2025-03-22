import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/uploadimges"; // Cloudinary upload function

export async function POST(req: Request) {
    try {
        const { images, universityName }: { images: { [key: string]: string }, universityName: string } = await req.json();
        if (!images || Object.keys(images).length === 0 || !universityName) {
            return NextResponse.json(
                { error: "No images or university name provided" },
                { status: 400 }
            );
        }
        // Upload images in parallel
        const uploadedImages = await Promise.all(
            Object.entries(images).map(async ([imageType, base64Image]) => {
                const imageName = `${universityName}_${imageType}`.replace(/\s+/g, "_"); // Format filename
                const result = await uploadImage(base64Image, "universities", imageName);
                return { [imageType]: result };
            })
        );
        // Convert array of objects to a single object
        const imageUrls = Object.assign({}, ...uploadedImages);
        return NextResponse.json({ imageUrls }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error processing request:", error);
            return NextResponse.json(
                { message: "Failed to process the request", error: error.message },
                { status: 500 }
            );
        } else {
            console.error("Error processing request:", error);
            return NextResponse.json(
                { message: "Failed to process the request", error: "Unknown error" },
                { status: 500 }
            );
        }
    }
}
