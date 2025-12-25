import { NextResponse } from 'next/server';
import { storage, EBOOK_BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(request) {
  try {
    // Debug: Check env vars
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.APPWRITE_API_KEY) {
      return NextResponse.json({ error: 'Missing Appwrite credentials' }, { status: 500 });
    }
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Generate unique file ID
    const fileId = ID.unique();
    
    // Upload to Appwrite Storage
    const uploadedFile = await storage.createFile(
      EBOOK_BUCKET_ID,
      fileId,
      file
    );

    // Return the file ID (we'll use this to get download URL later)
    return NextResponse.json({ 
      fileId: uploadedFile.$id,
      url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${EBOOK_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', error.message, error.code, error.type);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
