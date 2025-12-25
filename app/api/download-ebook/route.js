import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const ebookUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename') || 'ebook.pdf';

    if (!ebookUrl) {
      return NextResponse.json({ error: 'Missing eBook URL' }, { status: 400 });
    }

    // Additional security: Check referer to prevent direct access
    const headersList = headers();
    const referer = headersList.get('referer');
    const host = headersList.get('host');
    
    if (!referer || !referer.includes(host)) {
      return NextResponse.json({ error: 'Access denied: Invalid request source' }, { status: 403 });
    }

    // Fetch from Cloudinary URL
    const response = await fetch(ebookUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch eBook' }, { status: 500 });
    }
    const fileBuffer = await response.arrayBuffer();
    
    const cleanFilename = filename.replace(/[^a-zA-Z0-9\s]/g, '_');

    // Return the file with strict security headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cleanFilename}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      },
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}