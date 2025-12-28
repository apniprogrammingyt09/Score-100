import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { users } = await request.json();
    
    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: 'Users array is required' }, { status: 400 });
    }

    let updated = 0;
    let errors = 0;

    for (const user of users) {
      try {
        if (user.id && user.email && !user.hasEmail) {
          await updateDoc(doc(db, 'users', user.id), {
            email: user.email
          });
          updated++;
        }
      } catch (error) {
        console.error(`Error updating user ${user.id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      updated, 
      errors,
      message: `Updated ${updated} users, ${errors} errors` 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update users' }, { status: 500 });
  }
}