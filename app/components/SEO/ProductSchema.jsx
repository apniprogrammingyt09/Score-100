'use client';

export default function ProductSchema({ product }) {
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
      }
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
    educationalLevel: product.class || 'Secondary Education',
    learningResourceType: 'Question Bank',
    educationalUse: 'Board Exam Preparation'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}