import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebase_admin';
import { storage, EBOOK_BUCKET_ID } from '@/lib/appwrite';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminDB) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');
    const uid = url.searchParams.get('uid');

    // Strict parameter validation
    if (!orderId || !productId || !uid) {
      return NextResponse.json({ error: 'Access denied: Missing parameters' }, { status: 400 });
    }

    // Additional security: Check referer to prevent direct access
    const headersList = headers();
    const referer = headersList.get('referer');
    const host = headersList.get('host');
    
    if (!referer || !referer.includes(host)) {
      return NextResponse.json({ error: 'Access denied: Invalid request source' }, { status: 403 });
    }

    // Verify order exists and belongs to user
    const orderDoc = await adminDB.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Access denied: Order not found' }, { status: 404 });
    }

    const orderData = orderDoc.data();
    
    // Strict user verification
    if (orderData.uid !== uid) {
      return NextResponse.json({ error: 'Access denied: Unauthorized user' }, { status: 403 });
    }

    // Verify payment status (only allow completed payments)
    if (orderData.paymentMode === 'PREPAID' && orderData.status !== 'completed' && !orderData.checkout?.payment_status) {
      return NextResponse.json({ error: 'Access denied: Payment not completed' }, { status: 403 });
    }

    // Verify product exists in this specific order
    const hasProduct = orderData.checkout?.line_items?.some(item => {
      const itemProductId = item.productId || item.price_data?.product_data?.productId;
      return itemProductId === productId;
    });

    if (!hasProduct) {
      return NextResponse.json({ error: 'Access denied: Product not purchased in this order' }, { status: 403 });
    }

    // Get product and verify it's an eBook
    const productDoc = await adminDB.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Access denied: Product not found' }, { status: 404 });
    }

    const productData = productDoc.data();
    if (!productData.isEbook && !productData.ebookFileId && !productData.ebookUrl) {
      return NextResponse.json({ error: 'Access denied: Not an eBook product' }, { status: 403 });
    }
    const ebookFileId = productData.ebookFileId;
    const ebookUrl = productData.ebookUrl;

    if (!ebookFileId && !ebookUrl) {
      return NextResponse.json({ error: 'eBook not found' }, { status: 404 });
    }

    let fileBuffer;
    
    if (ebookFileId) {
      // Get file from Appwrite Storage
      fileBuffer = await storage.getFileDownload(EBOOK_BUCKET_ID, ebookFileId);
    } else if (ebookUrl) {
      // Fallback: fetch from URL (for old uploads)
      const response = await fetch(ebookUrl);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch eBook' }, { status: 500 });
      }
      fileBuffer = await response.arrayBuffer();
    }
    
    const productTitle = productDoc.data().title || 'ebook';
    const filename = `${productTitle.replace(/[^a-zA-Z0-9\s]/g, '_')}.pdf`;

    // Log the download for security audit
    await adminDB.collection('ebook_downloads').add({
      orderId,
      productId,
      uid,
      downloadTime: new Date(),
      userAgent: headersList.get('user-agent'),
      ip: headersList.get('x-forwarded-for') || 'unknown'
    });

    // Return the file with strict security headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
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