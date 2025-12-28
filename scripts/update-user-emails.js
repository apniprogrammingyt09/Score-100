import { adminDB, adminAuth } from '../lib/firebase_admin.js';

async function updateUserEmails() {
  try {
    console.log('Starting user email update...');
    
    // Get all user documents
    const usersSnapshot = await adminDB.collection('users').get();
    console.log(`Found ${usersSnapshot.size} user documents`);
    
    let updated = 0;
    let errors = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id;
      const userData = userDoc.data();
      
      // Skip if email already exists
      if (userData.email) {
        console.log(`User ${uid} already has email: ${userData.email}`);
        continue;
      }
      
      try {
        // Get email from Firebase Auth
        const authUser = await adminAuth.getUser(uid);
        
        if (authUser.email) {
          // Update user document with email
          await adminDB.collection('users').doc(uid).update({
            email: authUser.email
          });
          
          console.log(`Updated user ${uid} with email: ${authUser.email}`);
          updated++;
        } else {
          console.log(`No email found for user ${uid}`);
        }
      } catch (error) {
        console.error(`Error updating user ${uid}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\nUpdate complete:`);
    console.log(`- Updated: ${updated} users`);
    console.log(`- Errors: ${errors} users`);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

updateUserEmails();