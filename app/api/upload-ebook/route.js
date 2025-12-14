import { NextResponse } from 'next/server';
import { storage, EBOOK_BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(request) {
  try {
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
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}