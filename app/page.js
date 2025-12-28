import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedProductSlider from "./components/Sliders";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReviews from "./components/CustomerReviews";
import Brands from "./components/Brands";
import { getBrands } from "@/lib/firestore/brands/read_server";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Score 100 Books - Question Bank for Class 9-12 | CBSE & MPBSE',
  description: 'Buy Score 100 series question bank books for CBSE & MPBSE Board Exams. Previous Year Papers, Solved PYQs, Revision Notes, Mindmaps for Class 9, 10, 11 & 12. Mathematics, Science, Social Science, English & Hindi.',
  keywords: 'CBSE question bank, MPBSE books, class 9 books, class 10 books, class 11 books, class 12 books, previous year papers, solved PYQs, revision notes, mindmaps, mathematics books, science books, social science books, english books, hindi books, board exam preparation, Score 100 series, buy question bank books online',
  openGraph: {
    title: 'Score 100 Books - Question Bank for Class 9-12 | CBSE & MPBSE',
    description: 'Buy Score 100 series question bank books for CBSE & MPBSE Board Exams. Previous Year Papers, Solved PYQs, Revision Notes, Mindmaps.',
    images: ['/hero.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Score 100 Books - Question Bank for Class 9-12',
    description: 'Buy Score 100 series question bank books for CBSE & MPBSE Board Exams.',
    images: ['/hero.png'],
  },
};

export default async function Home() {
  const [featuredProducts, collections, categories, products, brands] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getProducts(),
      getBrands(),
    ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Score 100 Books',
    description: 'Leading provider of question bank books for CBSE & MPBSE Board Exams',
    url: process.env.NEXT_PUBLIC_DOMAIN || 'https://www.score100.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_DOMAIN || 'https://www.score100.in'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Score 100 Books',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_DOMAIN || 'https://www.score100.in'}/logo.png`
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
        <Header />
        <Hero />
        <FeaturedProductSlider featuredProducts={featuredProducts} />
        <Collections collections={collections} />
        <Categories categories={categories} />
        <ProductsGridView products={products} />
        <CustomerReviews />
        <Brands brands={brands} />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
