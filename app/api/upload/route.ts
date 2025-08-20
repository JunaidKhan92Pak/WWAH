import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Validate and get environment variables with proper typing
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Initialize S3 client with validated environment variables
const s3 = new S3Client({
  region: getRequiredEnvVar("AWS_REGION"),
  credentials: {
    accessKeyId: getRequiredEnvVar("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnvVar("AWS_SECRET_ACCESS_KEY"),
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const bucketName = getRequiredEnvVar("AWS_S3_BUCKET_NAME");

    console.log("Uploading to S3:", {
      bucket: bucketName,
      fileName,
      fileSize: file.size,
      fileType: file.type,
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      // Remove ACL as it might cause issues with newer S3 configurations
      // ACL: "public-read",
    });

    await s3.send(command);

    const url = `https://${bucketName}.s3.${getRequiredEnvVar(
      "AWS_REGION"
    )}.amazonaws.com/${fileName}`;

    console.log("Upload successful:", url);
    return NextResponse.json({ url, success: true });
  } catch (error: unknown) {
    console.error("S3 Upload Error:", error);

    // Provide more specific error messages
    let errorMessage = "Upload failed";
    if (error instanceof Error) {
      if (error.name === "CredentialsProviderError") {
        errorMessage = "AWS credentials invalid";
      } else if (error.name === "NoSuchBucket") {
        errorMessage = "S3 bucket not found";
      } else if (error.name === "AccessDenied") {
        errorMessage = "S3 access denied";
      } else if (
        error.message?.includes("Missing required environment variable")
      ) {
        errorMessage = "Server configuration error";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
