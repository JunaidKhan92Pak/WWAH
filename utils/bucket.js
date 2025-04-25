
const { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

// Use environment variables for sensitive information
const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Uploads images to S3
 * @param {Object} images - Object with image type as key and base64 data as value
 * @param {string} folderName - Folder name to organize images
 * @param {string} uploadType - Type of upload ('image' or 'document')
 * @returns {Object} URLs and keys of uploaded files
 */
exports.uploadImages = async (images, folderName, uploadType = 'image') => {
    if (!images || Object.keys(images).length === 0) {
        throw new Error('No images provided for upload');
    }

    const uploadResults = {};
    const locations = {};

    const allowedMimeTypes = {
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        ...(uploadType === 'document' && { 'application/pdf': 'pdf' }),
    };

    try {
        // Process each image in the object
        await Promise.all(
            Object.entries(images).map(async ([imageType, base64Data]) => {
                // Skip if no image data
                if (!base64Data) return;

                // Extract file content and mime type from base64
                const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

                if (!matches || matches.length !== 3) {
                    throw new Error(`Invalid base64 format for ${imageType}`);
                }

                const mimeType = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');

                // Validate mime type
                const fileExtension = allowedMimeTypes[mimeType];
                if (!fileExtension) {
                    throw new Error(`Unsupported file type: ${mimeType} for ${imageType}`);
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

                uploadResults[imageType] = uploadPath;
                locations[imageType] = fileLocation;
            })
        );

        return { urls: locations, keys: uploadResults };

    } catch (error) {
        throw new Error(`Error uploading images: ${error.message}`);
    }
};

/**
 * Removes a file from S3
 * @param {string} fileKey - S3 file key
 * @returns {Object} S3 response
 */
exports.removeFromS3 = async fileKey => {
    if (!fileKey) {
        throw new Error('No file key provided for deletion');
    }

    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileKey,
        });

        const response = await s3.send(deleteCommand);
        return response;
    } catch (error) {
        throw new Error(`Error removing file ${fileKey}: ${error.message}`);
    }
};

/**
 * Removes multiple files from S3
 * @param {Array} fileKeys - Array of S3 file keys
 * @returns {Object} S3 response
 */
exports.bulkRemoveFromS3 = async fileKeys => {
    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
        throw new Error('No file keys provided for deletion');
    }

    try {
        const deleteCommand = new DeleteObjectsCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Delete: {
                Objects: fileKeys.map(key => ({ Key: key })),
            },
        });

        const response = await s3.send(deleteCommand);
        return response;
    } catch (error) {
        throw new Error(`Error removing files: ${error.message}`);
    }
};