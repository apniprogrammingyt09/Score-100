/**
 * Vercel Blob storage upload utilities
 */

/**
 * Upload file to Vercel Blob storage
 */
export async function uploadToBlob(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

/**
 * Upload multiple files to Vercel Blob storage
 */
export async function uploadMultipleToBlob(files) {
  const uploads = Object.entries(files).map(async ([key, file]) => {
    const result = await uploadToBlob(file);
    return [key, result];
  });

  const results = await Promise.all(uploads);
  return Object.fromEntries(results);
}