import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  if (typeof file !== 'string' || !/^data:image\/[^;]+;base64,/i.test(file)) {
    const error = new Error('Expected a base64-encoded image data URL');
    error.code = 'IMAGE_UPLOAD_FAILED';
    throw error;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'appointment-system',
      unique_filename: true,
    });

    if (!result.secure_url) {
      throw new Error('Cloudinary did not return a secure image URL');
    }

    return result.secure_url;
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown Cloudinary error';
    console.error('Cloudinary image upload failed:', details);

    const uploadError = new Error(`Image upload failed: ${details}`);
    uploadError.code = 'IMAGE_UPLOAD_FAILED';
    throw uploadError;
  }
};