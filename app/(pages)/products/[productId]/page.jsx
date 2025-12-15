import { getProduct } from "@/lib/firestore/products/read_server";
import Photos from "./components/Photos";
import Details from "./components/Details";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReview from "./components/AddReiveiw";
import AuthContextProvider from "@/contexts/AuthContext";

export async function generateMetadata({ params }) {
  const { productId } = params;
  const product = await getProduct({ id: productId });

  if (!product) {
    return {
      title: 'Product Not Found | Score 100 Books',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.title} | Score 100 Books`,
    description: product.shortDescription || product.description || `Buy ${product.title} - Question bank book for CBSE & MPBSE board exams. Previous year papers, solved PYQs, revision notes.`,
    keywords: `${product.title}, question bank, CBSE, MPBSE, ${product.category || ''}, board exam books, previous year papers, solved PYQs`,
    openGraph: {
      title: `${product.title} | Score 100 Books`,
      description: product.shortDescription || product.description,
      images: [{
        url: product.featureImageURL,
        width: 800,
        height: 600,
        alt: product.title,
      }],
      type: 'product',
      url: `/products/${productId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Score 100 Books`,
      description: product.shortDescription || product.description,
      images: [product.featureImageURL],
    },
    alternates: {
      canonical: `/products/${productId}`,
    },
  };
}

export default async function Page({ params }) {
  const { productId } = params;
  const product = await getProduct({ id: productId });
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.description,
    image: [product.featureImageURL, ...(product.imageList || [])],
    brand: {
      '@type': 'Brand',
      name: 'Score 100 Books'
    },
    category: product.category || 'Educational Books',
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Score 100 Books'
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    isbn: product.isbn,
    author: product.author || 'Score 100 Books Team',
    publisher: {
      '@type': 'Organization',
      name: 'Score 100 Books'
    },
    datePublished: product.publishDate,
    inLanguage: 'en-IN',
    educationalLevel: product.class || 'Secondary Education',
    learningResourceType: 'Question Bank',
    educationalUse: 'Board Exam Preparation'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="p-5 md:p-10">
        <section className="flex flex-col-reverse md:flex-row gap-3">
          <Photos
            imageList={[product?.featureImageURL, ...(product?.imageList ?? [])]}
          />
          <Details product={product} />
        </section>
        <div className="flex justify-center py-10">
          <AuthContextProvider>
            <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
              <AddReview productId={productId} />
              <Reviews productId={productId} />
            </div>
          </AuthContextProvider>
        </div>
        <RelatedProducts categoryId={product?.categoryId} />
      </main>
    </>
  );
}
