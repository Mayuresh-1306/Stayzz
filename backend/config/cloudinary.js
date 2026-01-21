import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const cloudinaryV2 = cloudinary.v2;
let storage;
let cloudinaryInstance = null;

if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
    cloudinaryV2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinaryV2,
        params: {
            folder: 'stayzz_DEV',
            allowedFormats: ["png", "jpg", "jpeg"],
        },
    });

    cloudinaryInstance = cloudinaryV2;
} else {
    // Fix: Use fileURLToPath to properly convert URL to path on Windows
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', 'uploads'));
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
            cb(null, uniqueName);
        }
    });
}

export { cloudinaryInstance as cloudinary, storage };
