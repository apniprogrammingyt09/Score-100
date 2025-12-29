export default function manifest() {
  return {
    name: 'Score 100 Books - Question Bank Books Store',
    short_name: 'Score100',
    description: 'Premium question bank books for CBSE & MPBSE board exams',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#312e81',
    orientation: 'portrait',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['education', 'books', 'shopping'],
    lang: 'en',
    dir: 'ltr',
  };
}