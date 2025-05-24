// import cloudinary from "cloudinary";
// cloudinary.v2.config({
//     // cloud_name: "do7lmtq9f",
//     cloud_name: "diktirwh8",
//     // api_key: "971684736325193", //junaid
//     api_key: "758583315993972", // hafiz zain
//     // api_secret: "l7RmA6TWCvGrKAJe5N1Jdnug-Ig",
//     api_secret: "xFMq91tuoL6F9P71w7KObWFyZhA",
// });
// export const uploadImage = async (
//   base64Image: string,
//   universitiesImages: string,
//   filename: string
// ) => {
//   try {
//     // Ensure only raw base64 data is passed (remove 'data:image/png;base64,')
//     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
//     const result = await cloudinary.v2.uploader.upload_large(
//       `data:image/png;base64,${base64Data}`,
//       {
//         folder: universitiesImages, // Store in specified folder
//         public_id: filename, // Assign a proper filename
//         overwrite: true, // Replace existing image if the name matches
//         resource_type: "image",
//         timeout: 120000,
//         quality: "auto:eco", // :arrow_left: Automatically optimize image quality
//         width: 1024, // :arrow_left: Resize to max width of 1024px
//         crop: "limit", // :arrow_left: Prevents excessive resizing
//       }
//     );
//     return result.secure_url;
//   } catch (error) {
//     console.error("Cloudinary upload failed:", error);
//     return null;
//   }
// };
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "diktirwh8",
  api_key: "758583315993972",
  api_secret: "xFMq91tuoL6F9P71w7KObWFyZhA",
});

export const uploadFile = async (
  base64Data: string,
  folder: string,
  filename: string
) => {
  try {
    const cleanedData = base64Data.replace(/^data:.*;base64,/, "");

    // Detect MIME type from base64 string (you can also pass it separately)
    const mimeMatch = base64Data.match(/^data:(.*);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const result = await cloudinary.v2.uploader.upload(
      `data:${mimeType};base64,${cleanedData}`,
      {
        folder,
        public_id: filename,
        resource_type: "auto", // Let Cloudinary decide image/raw/video
        overwrite: true,
      }
    );

    return result.secure_url; // Use this for preview/download
  } catch (error) {
    console.error("File upload failed:", error);
    return null;
  }
};
