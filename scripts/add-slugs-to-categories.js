require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

async function addSlugsToCategories() {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.docs.length} categories to update...`);
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      if (!data.slug && data.name) {
        const slug = generateSlug(data.name);
        await updateDoc(doc(db, 'categories', docSnap.id), { slug });
        console.log(`Updated category "${data.name}" with slug: ${slug}`);
      }
    }
    
    console.log('All categories updated with slugs!');
  } catch (error) {
    console.error('Error updating categories:', error);
  }
}

addSlugsToCategories();