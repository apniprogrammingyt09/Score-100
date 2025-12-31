import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getProduct } from '@/lib/firestore/products/read_server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const legacyUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename') || 'ebook.pdf';
    
    // Handle legacy URL format
    if (legacyUrl && !productId) {
      const response = await fetch(legacyUrl);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch eBook' }, { status: 500 });
      }
      const fileBuffer = await response.arrayBuffer();
      const cleanFilename = filename.replace(/[^a-zA-Z0-9\s\.]/g, '_');
    const finalFilename = cleanFilename.endsWith('.pdf') ? cleanFilename : cleanFilename + '.pdf';
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${finalFilename}"`,
          'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        },
      });
    }
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Always fetch latest eBook URL from database
    const product = await getProduct({ id: productId });
    
    if (!product || !product.ebookUrl) {
      return NextResponse.json({ error: 'eBook not found' }, { status: 404 });
    }

    const ebookUrl = product.ebookUrl;

    // Additional security: Check referer to prevent direct access (skip in development)
    const headersList = headers();
    const referer = headersList.get('referer');
    const host = headersList.get('host');
    
    // Skip referer check for localhost/development
    if (referer && host && !host.includes('localhost') && !referer.includes(host)) {
      return NextResponse.json({ error: 'Access denied: Invalid request source' }, { status: 403 });
    }

    // If URL contains appwrite, try to redirect to Vercel Blob version
    if (ebookUrl.includes('appwrite.io')) {
      return NextResponse.json({ 
        error: 'This eBook is being migrated to new storage. Please try again in a few minutes.',
        needsUpdate: true 
      }, { status: 503 });
    }

    // Fetch from stored Cloudinary URL
    const response = await fetch(ebookUrl);
    if (!response.ok) {
      console.error('Cloudinary fetch failed:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch eBook from storage' }, { status: 500 });
    }
    const fileBuffer = await response.arrayBuffer();
    
    const cleanFilename = filename.replace(/[^a-zA-Z0-9\s\.]/g, '_');
    const finalFilename = cleanFilename.endsWith('.pdf') ? cleanFilename : cleanFilename + '.pdf';

    // Return the file with strict security headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
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