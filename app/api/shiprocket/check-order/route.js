import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId');

    // Get Shiprocket token
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });
    const authData = await authResponse.json();
    const token = authData.token;

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