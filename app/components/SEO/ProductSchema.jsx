export function ProductSchema({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.description,
    image: product.featureImageURL,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Score 100'
    },
    category: product.category,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://www.score100.in/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.salePrice,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Score 100 Books'
      }
    },
    aggregateRating: product.reviewsCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating || 5,
      reviewCount: product.reviewsCount || 1
    } : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}