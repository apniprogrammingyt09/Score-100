import admin from "firebase-admin";

let adminDB;
let adminAuth;

try {
  console.log('Environment variable exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEYS);
  
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEYS 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEYS)
    : null;

  if (serviceAccount) {
    console.log('Service account parsed successfully');
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client email:', serviceAccount.client_email);
    console.log('Private key starts with:', serviceAccount.private_key?.substring(0, 50));
    
    // Fix private key newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      console.log('Fixed private key starts with:', serviceAccount.private_key?.substring(0, 50));
    }
    
    if (admin.apps.length === 0) {
      console.log('Initializing Firebase Admin...');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin initialized successfully');
    }
  } else {
    console.log('No service account found');
  }

  adminDB = admin.firestore();
  adminAuth = admin.auth();
  console.log('Firestore instance created');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  adminDB = null;
  adminAuth = null;
}

export { admin, adminDB, adminAuth };
