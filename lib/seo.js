// SEO utility functions for Score 100 Books

export const generateProductJsonLd = (product) => {
  return {
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
};

export const generateCategoryJsonLd = (category, products = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Books`,
    description: `${category.name} question bank books from Score 100 series for CBSE & MPBSE board exams`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${category.name} Books`,
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
};

export const generateBreadcrumbJsonLd = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

export const generateOrganizationJsonLd = () => {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Score 100 Books',
    description: 'Leading provider of question bank books for CBSE & MPBSE Board Exams',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
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
};

export const generateWebsiteJsonLd = () => {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Score 100 Books',
    description: 'Leading provider of question bank books for CBSE & MPBSE Board Exams',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Score 100 Books',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };
};

// SEO metadata generators
export const generateProductMetadata = (product, productId) => {
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
};

export const generateCategoryMetadata = (category, categoryId) => {
  if (!category) {
    return {
      title: 'Category Not Found | Score 100 Books',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Books | Score 100 Question Bank | CBSE & MPBSE`,
    description: `Shop ${category.name} question bank books from Score 100 series. Previous year papers, solved PYQs, revision notes for CBSE & MPBSE board exams. Best books for ${category.name} preparation.`,
    keywords: `${category.name} books, ${category.name} question bank, CBSE ${category.name}, MPBSE ${category.name}, ${category.name} previous year papers, ${category.name} solved PYQs, Score 100 ${category.name}`,
    openGraph: {
      title: `${category.name} Books | Score 100 Books`,
      description: `Shop ${category.name} question bank books from Score 100 series for CBSE & MPBSE board exams.`,
      images: category.imageURL ? [{
        url: category.imageURL,
        width: 800,
        height: 600,
        alt: `${category.name} Books - Score 100 Series`,
      }] : [],
      type: 'website',
      url: `/categories/${categoryId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Books | Score 100 Books`,
      description: `Shop ${category.name} question bank books from Score 100 series.`,
      images: category.imageURL ? [category.imageURL] : [],
    },
    alternates: {
      canonical: `/categories/${categoryId}`,
    },
  };
};