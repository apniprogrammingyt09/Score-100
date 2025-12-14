require('dotenv').config({ path: '.env.local' });
const { Client, Storage, Permission, Role } = require('node-appwrite');

async function createBucket() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(client);

  try {
    // Create the ebooks bucket
    const bucket = await storage.createBucket(
      'ebooks', // bucketId
      'eBooks Storage', // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ], // permissions
      false, // fileSecurity
      true, // enabled
50000000, // maximumFileSize (50MB)
      ['pdf'], // allowedFileExtensions
      'none', // compression
      false, // encryption
      false // antivirus
    );

    console.log('✅ Bucket created successfully!');
    console.log('Bucket ID:', bucket.$id);
    console.log('Bucket Name:', bucket.name);
  } catch (error) {
    if (error.code === 409) {
      console.log('✅ Bucket already exists!');
    } else {
      console.error('❌ Error creating bucket:', error.message);
    }
  }
}

createBucket();