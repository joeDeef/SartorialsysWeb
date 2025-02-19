import fs from "fs";
import path from "path";
import saveCloudinary from "./saveCloudinary.js";

const uploadProductImages = async (files, folderName) => {
  if (!files || !files.image) return [];

  let imageUrls = [];

  for (const image of files.image) {
    const filePath = image.path;
    const pathFile = path.join(path.resolve(""), filePath);

    try {
      const imageUrl = await saveCloudinary(pathFile, folderName);
      imageUrls.push(imageUrl);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Error uploading image");
    }

    fs.unlinkSync(filePath);
  }

  return imageUrls;
};

export default uploadProductImages;