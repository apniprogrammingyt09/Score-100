import { adminAuth, adminDB } from '@/lib/firebase_admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { uids } = await request.json();
    console.log('Received UIDs:', uids);
    
    if (!uids || !Array.isArray(uids)) {
      return NextResponse.json({ error: 'UIDs array is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.error('Admin Auth not initialized');
      return NextResponse.json({ error: 'Admin Auth not available' }, { status: 500 });
    }

    const users = {};
    
    for (const uid of uids) {
      try {
        console.log('Fetching user:', uid);
        const userRecord = await adminAuth.getUser(uid);
        console.log('User record:', { email: userRecord.email, displayName: userRecord.displayName });
        users[uid] = {
          email: userRecord.email,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL
        };
      } catch (error) {
        console.error('Error fetching user:', uid, error.message);
        users[uid] = { email: null, displayName: null, photoURL: null };
      }
    }

    console.log('Returning users:', users);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}