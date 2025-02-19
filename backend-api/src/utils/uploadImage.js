import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import variables from '../config/env.js'

// Función para subir una imagen a Cloudinary
async function uploadImage(filePath, folderName) {
    return new Promise((resolve, reject) => {
        // Configura Cloudinary
        cloudinary.config({
            cloud_name: variables.CLOUD_NAME,
            api_key: variables.API_KEY,
            api_secret: variables.API_SECRET
        });

        const fileBuffer = fs.readFileSync(filePath);
        const uploadResult = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                public_id: `users/${Date.now()}`,
                folder: folderName,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadResult.end(fileBuffer);
    });
}

export default uploadImage;
