import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    // Get Shiprocket token
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/api/shiprocket/auth`, {
      method: 'POST',
    });
    const { token } = await authResponse.json();

    // Get all orders from Shiprocket
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    return NextResponse.json({
      orders: result.data || result,
      total: result.data?.length || 0
    });

  } catch (error) {
    console.error('Shiprocket orders fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}