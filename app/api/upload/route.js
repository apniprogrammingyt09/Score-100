import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Fallback: Return a placeholder URL for now
      return NextResponse.json({ 
        error: 'Upload service temporarily unavailable. Please configure BLOB_READ_WRITE_TOKEN in Vercel environment variables.' 
      }, { status: 503 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      url: blob.url,
      downloadUrl: blob.downloadUrl 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}