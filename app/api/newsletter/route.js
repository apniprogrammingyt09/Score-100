import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebase_admin';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscription = await adminDB
      .collection('newsletter_subscribers')
      .where('email', '==', email)
      .get();

    if (!existingSubscription.empty) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }

    // Add new subscription
    await adminDB.collection('newsletter_subscribers').add({
      email,
      subscribedAt: new Date(),
      status: 'active'
    });



    return NextResponse.json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}