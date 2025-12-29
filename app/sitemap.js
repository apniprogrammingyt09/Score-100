import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap() {
  const baseUrl = 'https://www.score100.in';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/boards`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    // Dynamic product pages
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const productPages = productsSnapshot.docs.map((doc) => {
      const product = doc.data();
      return {
        url: `${baseUrl}/products/${product.id}`,
        lastModified: product.timestampUpdate?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

    // Dynamic category pages
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categoryPages = categoriesSnapshot.docs.map((doc) => {
      const category = doc.data();
      return {
        url: `${baseUrl}/categories/${category.id}`,
        lastModified: category.timestampUpdate?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });

    // Dynamic collection pages
    const collectionsSnapshot = await getDocs(collection(db, 'collections'));
    const collectionPages = collectionsSnapshot.docs.map((doc) => {
      const collection = doc.data();
      return {
        url: `${baseUrl}/collections/${collection.id}`,
        lastModified: collection.timestampUpdate?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });

    return [...staticPages, ...productPages, ...categoryPages, ...collectionPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}