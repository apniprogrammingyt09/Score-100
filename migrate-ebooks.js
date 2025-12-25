// Migration script to update all products from Appwrite to Cloudinary URLs
// Run this in your browser console on the admin panel

const migrateEbookUrls = async () => {
  console.log('Starting eBook URL migration...');
  
  try {
    // This would need to be run server-side with Firebase Admin
    // For now, you'll need to manually update products in Firebase console
    
    console.log('Migration steps:');
    console.log('1. Go to Firebase Console > Firestore');
    console.log('2. Find products collection');
    console.log('3. For each product with ebookUrl containing "appwrite.io":');
    console.log('   - Upload the PDF to Cloudinary via admin panel');
    console.log('   - Update the ebookUrl field with new Cloudinary URL');
    console.log('4. Remove any ebookFileId fields (old Appwrite references)');
    
    // Example of what the URLs should look like:
    console.log('Old URL format: https://sgp.cloud.appwrite.io/v1/storage/buckets/...');
    console.log('New URL format: https://res.cloudinary.com/dpw85lnz8/raw/upload/...');
    
  } catch (error) {
    console.error('Migration error:', error);
  }
};

// Run the migration info
migrateEbookUrls();