require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function createAdmin() {
  const adminEmail = 'admin@gmail.com';
  
  try {
    await db.collection('admins').doc(adminEmail).set({
      id: adminEmail,
      name: 'Admin User',
      email: adminEmail,
      imageURL: '',
      timestampCreate: admin.firestore.Timestamp.now(),
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('You can now sign up with this email and it will have admin privileges.');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();