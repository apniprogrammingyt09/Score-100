export const admin = require("firebase-admin");

let adminDB;

try {
  const serviceAccount = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS 
    ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS)
    : null;

  if (serviceAccount && admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  adminDB = admin.firestore();
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  adminDB = null;
}

export { adminDB };
