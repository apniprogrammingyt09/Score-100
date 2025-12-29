export default function robots() {
  return {
    rules: [
      {
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
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/account/',
          '/cart/',
          '/favorites/',
          '/ebooks/',
        ],
      },
    ],
    sitemap: 'https://www.score100.in/sitemap.xml',
    host: 'https://www.score100.in',
  };
}