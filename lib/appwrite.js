import { Client, Storage } from 'node-appwrite';

// Server-side client with API key
const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

export const storage = new Storage(serverClient);

// Storage bucket ID for eBooks
export const EBOOK_BUCKET_ID = 'ebooks';