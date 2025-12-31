import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
  try {
    const { timestamp, folder } = await request.json();
    
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );
    
    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}