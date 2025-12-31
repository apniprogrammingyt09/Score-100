/**
 * Client-side Cloudinary upload utilities
 * For uploading large files directly from browser to Cloudinary
 */

/**
 * Upload file directly to Cloudinary from browser
 * Bypasses server to avoid Vercel's 4.5MB limit
 */
export async function uploadToCloudinary(file, uploadPreset = 'ebooks') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpw85lnz8';
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Cloudinary upload failed');
  }

  return response.json();
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(files, uploadPreset = 'ebooks') {
  const uploads = Object.entries(files).map(async ([key, file]) => {
    const result = await uploadToCloudinary(file, uploadPreset);
    return [key, result];
  });

  const results = await Promise.all(uploads);
  return Object.fromEntries(results);
}