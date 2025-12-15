import { Suspense } from 'react';
import { ProductCard } from '@/app/components/Products';
import { searchProducts } from '@/lib/firestore/products/read_server';

export const metadata = {
  title: 'Search Books | Score 100 Question Bank | CBSE & MPBSE',
  description: 'Search for question bank books from Score 100 series. Find CBSE & MPBSE books for Class 9, 10, 11 & 12. Mathematics, Science, Social Science, English & Hindi books.',
  keywords: 'search books, question bank search, CBSE books search, MPBSE books search, Score 100 books search, find books online',
  openGraph: {
    title: 'Search Books | Score 100 Books',
    description: 'Search for question bank books from Score 100 series for CBSE & MPBSE board exams.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function SearchResults({ searchParams }) {
  const query = searchParams?.q || '';
  const products = query ? await searchProducts(query) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search Results for "${query}"`,
    description: `Search results for "${query}" in Score 100 Books question bank collection`,
    mainEntity: {
      '@type': 'ItemList',
      name: `Search Results for "${query}"`,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          description: product.shortDescription,
          image: product.featureImageURL,
          url: `/products/${product.id}`,
          offers: {
            '@type': 'Offer',
            price: product.salePrice || product.price,
            priceCurrency: 'INR'
          }
        }
      }))
    }
  };

  return (
    <>
      {query && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
        <div className="flex flex-col gap-6 max-w-[900px] p-5 w-full">
          <div className="text-center">
            <h1 className="font-semibold text-4xl mb-2">
              {query ? `Search Results for "${query}"` : 'Search Books'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {query 
                ? `Found ${products.length} books matching your search`
                : 'Search for question bank books from Score 100 series'
              }
            </p>
          </div>
          
          {query && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg mb-2">No books found for "{query}"</p>
                  <p className="text-gray-400">Try searching with different keywords</p>
                </div>
              )}
            </div>
          )}
          
          {!query && (
            <div className="text-center py-10">
              <p className="text-gray-500">Enter a search term to find books</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function SearchPage({ searchParams }) {
  return (
    <Suspense fallback={<div className="text-center py-10">Searching...</div>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}