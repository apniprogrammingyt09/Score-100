const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account file
// Place your service-account-key.json in the scripts folder
try {
  const serviceAccount = require('./service-account-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Please add service-account-key.json file to scripts folder');
  console.error('Download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const db = admin.firestore();

async function updateDownloadLinks() {
  try {
    console.log('Starting download link migration...');
    
    // Update users' checkout sessions
    const usersSnapshot = await db.collection('users').get();
    let updatedSessions = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Update checkout_sessions_cod
      const codSessions = await db.collection(`users/${userId}/checkout_sessions_cod`).get();
      for (const sessionDoc of codSessions.docs) {
        const sessionData = sessionDoc.data();
        if (sessionData.items) {
          let updated = false;
          const updatedItems = sessionData.items.map(item => {
            if (item.ebookUrl && !item.productId) {
              updated = true;
              return { ...item, productId: item.id };
            }
            return item;
          });
          
          if (updated) {
            await sessionDoc.ref.update({ items: updatedItems });
            updatedSessions++;
          }
        }
      }
    }
    
    // Update orders collection
    const ordersSnapshot = await db.collection('orders').get();
    let updatedOrders = 0;
    
    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data();
      if (orderData.items) {
        let updated = false;
        const updatedItems = orderData.items.map(item => {
          if (item.ebookUrl && !item.productId) {
            updated = true;
            return { ...item, productId: item.id };
          }
          return item;
        });
        
        if (updated) {
          await orderDoc.ref.update({ items: updatedItems });
          updatedOrders++;
        }
      }
    }
    
    console.log(`Migration completed:`);
    console.log(`- Updated ${updatedSessions} checkout sessions`);
    console.log(`- Updated ${updatedOrders} orders`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

updateDownloadLinks();