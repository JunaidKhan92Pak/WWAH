
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client with environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not defined in the environment variables.");
}

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { images, universityName } = body;

        if (!images || !universityName) {
            return NextResponse.json({ error: 'Images and university name are required' }, { status: 400 });
        }

        // Sanitize university name for folder path
        const folderName = universityName.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // Process and upload each image
        const imageUrls: Record<string, string> = {};
        const imageKeys: Record<string, string> = {};

        // Process each image in parallel
        await Promise.all(
            Object.entries(images).map(async ([imageType, base64Data]) => {
                // Skip if no image data
                if (!base64Data) return;

                // Extract file content and mime type from base64
                if (typeof base64Data !== 'string') {
                    throw new Error(`Invalid data type for ${imageType}. Expected a string.`);
                }
                const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

                if (!matches || matches.length !== 3) {
                    throw new Error(`Invalid base64 format for ${imageType}`);
                }

                const mimeType = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');

                // Get file extension from mime type
                // Update: Allow only jpeg, jpg, and png - explicitly convert the extension to ensure consistency
                let fileExtension;
                if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
                    fileExtension = 'jpg';
                } else if (mimeType === 'image/png') {
                    fileExtension = 'png';
                } else if (mimeType === 'image/webp') {
                    fileExtension = 'webp';
                }
                else {
                    throw new Error(`Unsupported file type: ${mimeType} for ${imageType}. Only JPEG and PNG formats are supported.`);
                }

                // Generate a unique filename
                const timestamp = Date.now();
                const filename = `${imageType}_${timestamp}.${fileExtension}`;
                const uploadPath = `${folderName}/${filename}`;

                // Upload to S3
                const command = new PutObjectCommand({
                    Bucket: AWS_S3_BUCKET_NAME,
                    Key: uploadPath,
                    Body: buffer,
                    ContentType: mimeType,
                });

                await s3.send(command);

                // Generate the URL
                const fileLocation = `https://${AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadPath}`;

                imageUrls[imageType] = fileLocation;
                imageKeys[imageType] = uploadPath;
            })
        );

        return NextResponse.json({
            success: true,
            imageUrls,
            imageKeys
        });

    } catch (error) {
        console.error('Error uploading images:', error);
        return NextResponse.json({
            error: `Error uploading images: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 });
    }
}