import cloudinary from "cloudinary";
cloudinary.v2.config({
    // cloud_name: "do7lmtq9f",
    cloud_name: "diktirwh8",
    // api_key: "971684736325193", //junaid
    api_key: "758583315993972", // hafiz zain
    // api_secret: "l7RmA6TWCvGrKAJe5N1Jdnug-Ig",
    api_secret: "xFMq91tuoL6F9P71w7KObWFyZhA",
});
export const uploadImage = async (
  base64Image: string,
  universitiesImages: string,
  filename: string
) => {
  try {
    // Ensure only raw base64 data is passed (remove 'data:image/png;base64,')
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const result = await cloudinary.v2.uploader.upload_large(
      `data:image/png;base64,${base64Data}`,
      {
        folder: universitiesImages, // Store in specified folder
        public_id: filename, // Assign a proper filename
        overwrite: true, // Replace existing image if the name matches
        resource_type: "image",
        timeout: 120000,
        quality: "auto:eco", // :arrow_left: Automatically optimize image quality
        width: 1024, // :arrow_left: Resize to max width of 1024px
        crop: "limit", // :arrow_left: Prevents excessive resizing
      }
    );
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};
