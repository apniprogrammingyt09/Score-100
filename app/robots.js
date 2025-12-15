export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout/',
        '/account/',
        '/cart/',
        '/favorites/',
        '/ebooks/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}