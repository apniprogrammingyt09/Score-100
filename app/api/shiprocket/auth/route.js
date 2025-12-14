import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Shiprocket authentication failed');
    }

    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error('Shiprocket auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}