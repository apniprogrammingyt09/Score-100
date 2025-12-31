/**
 * Client-side Cloudinary upload for large files
 * Bypasses Vercel's 10MB serverless function limit
 */

export async function uploadToCloudinaryDirect(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpw85lnz8';
  
  // Generate signature on server
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureResponse = await fetch('/api/cloudinary/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp, folder: 'ebooks' })
  });
  
  const { signature, api_key } = await signatureResponse.json();
  
  // Upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('api_key', api_key);
  formData.append('folder', 'ebooks');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }
  
  return response.json();
}