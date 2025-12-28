export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.score100.in';
  
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