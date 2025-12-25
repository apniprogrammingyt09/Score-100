import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');
    const uid = searchParams.get('uid');

    if (!checkoutId || !uid) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Return success - actual processing will be done client-side
    return NextResponse.json({ 
      success: true, 
      checkoutId,
      uid,
      message: 'Use client-side processing'
    });

  } catch (error) {
    console.error('Checkout processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}