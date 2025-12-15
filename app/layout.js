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
    default: "Score100 - Best Question Bank Books for CBSE & MPBSE | Class 9-12",
    template: "%s | Score100"
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  description: "Score100 offers premium question bank books for CBSE & MPBSE Board Exams. Get Score100 series books with Previous Year Papers, Solved PYQs, Revision Notes & Mindmaps for Class 9, 10, 11 & 12. Mathematics, Science, Social Science, English & Hindi.",
  keywords: ["Score100", "Score100 books", "Score100 question bank", "CBSE question bank", "MPBSE books", "class 9 books", "class 10 books", "class 11 books", "class 12 books", "previous year papers", "solved PYQs", "revision notes", "mindmaps", "mathematics books", "science books", "social science books", "english books", "hindi books", "board exam preparation", "Score100 series", "buy Score100 books online"],
  authors: [{ name: "Score100" }],
  creator: "Score100",
  publisher: "Score100",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.score100.in'),
  alternates: {
    canonical: 'https://www.score100.in/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.score100.in/',
    title: 'Score100 - Best Question Bank Books for CBSE & MPBSE | Class 9-12',
    description: 'Score100 offers premium question bank books for CBSE & MPBSE Board Exams. Get Score100 series books with Previous Year Papers, Solved PYQs, Revision Notes & Mindmaps.',
    siteName: 'Score100',
    images: [{
      url: 'https://www.score100.in/logo.png',
      width: 1200,
      height: 630,
      alt: 'Score100 - Premium Question Bank Books Store',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Score100 - Best Question Bank Books for CBSE & MPBSE',
    description: 'Score100 offers premium question bank books for CBSE & MPBSE Board Exams with Previous Year Papers and Solved PYQs.',
    images: ['https://www.score100.in/logo.png'],
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
    google: 'edf2eaa366c4808f',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Score 100 Books',
    description: 'Leading provider of question bank books for CBSE & MPBSE Board Exams',
    url: 'https://www.score100.in',
    logo: 'https://www.score100.in/logo.png',
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
