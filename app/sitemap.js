import { getProducts } from '@/lib/firestore/products/read_server';
import { getCategories } from '@/lib/firestore/categories/read_server';
import { getCollections } from '@/lib/firestore/collections/read_server';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app';
  
  // Get dynamic data
  const [products, categories, collections] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
  ]);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
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
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
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

  // Product pages
  const productPages = products?.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.timestampUpdate && typeof product.timestampUpdate.toDate === 'function' 
      ? product.timestampUpdate.toDate() 
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || [];

  // Category pages
  const categoryPages = categories?.map((category) => ({
    url: `${baseUrl}/categories/${category.slug || category.id}`,
    lastModified: category.timestampUpdate && typeof category.timestampUpdate.toDate === 'function'
      ? category.timestampUpdate.toDate()
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];

  // Collection pages
  const collectionPages = collections?.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug || collection.id}`,
    lastModified: collection.timestampUpdate && typeof collection.timestampUpdate.toDate === 'function'
      ? collection.timestampUpdate.toDate()
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...collectionPages,
  ];
}