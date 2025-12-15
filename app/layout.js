import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: "Score 100 Books - Question Bank for Class 9-12 | CBSE & MPBSE",
    template: "%s | Score 100 Books"
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  description: "Score 100 series of question bank books for CBSE & MPBSE Board Exams. Previous Year Papers, Solved PYQs, Revision Notes, Mindmaps for Class 9, 10, 11 & 12. Mathematics, Science, Social Science, English & Hindi.",
  keywords: ["CBSE question bank", "MPBSE books", "class 9 books", "class 10 books", "class 11 books", "class 12 books", "previous year papers", "solved PYQs", "revision notes", "mindmaps", "mathematics books", "science books", "social science books", "english books", "hindi books", "board exam preparation", "Score 100 series"],
  authors: [{ name: "Score 100 Books" }],
  creator: "Score 100 Books",
  publisher: "Score 100 Books",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Score 100 Books - Question Bank for Class 9-12 | CBSE & MPBSE',
    description: 'Score 100 series of question bank books for CBSE & MPBSE Board Exams. Previous Year Papers, Solved PYQs, Revision Notes, Mindmaps for Class 9, 10, 11 & 12.',
    siteName: 'Score 100 Books',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Score 100 Books - Question Bank Store',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Score 100 Books - Question Bank for Class 9-12',
    description: 'Score 100 series of question bank books for CBSE & MPBSE Board Exams.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Score 100 Books',
    description: 'Leading provider of question bank books for CBSE & MPBSE Board Exams',
    url: process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app'}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi']
    },
    areaServed: 'India',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Question Bank Books',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'CBSE Question Bank Books',
            category: 'Educational Books'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'MPBSE Question Bank Books',
            category: 'Educational Books'
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
