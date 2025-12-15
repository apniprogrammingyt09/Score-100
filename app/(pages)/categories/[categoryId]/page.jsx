import { ProductCard } from "@/app/components/Products";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const category = await getCategory({ id: categoryId });

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
}

export default async function Page({ params }) {
  const { categoryId } = params;
  const category = await getCategory({ id: categoryId });
  
  if (!category) {
    notFound();
  }
  
  // Use the actual category ID from the database, not the URL slug
  const products = await getProductsByCategory({ categoryId: category.id });
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Books`,
    description: `${category.name} question bank books from Score 100 series for CBSE & MPBSE board exams`,
    url: `/categories/${categoryId}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${category.name} Books`,
      numberOfItems: products?.length || 0,
      itemListElement: products?.map((product, index) => ({
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
      })) || []
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: '/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: '/categories'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `/categories/${categoryId}`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
        <div className="flex flex-col gap-6 max-w-[900px] p-5">
          <div className="text-center">
            <h1 className="font-semibold text-4xl mb-2">{category?.name} Books</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of {category?.name} question bank books from Score 100 series. 
              Perfect for CBSE & MPBSE board exam preparation with previous year papers and solved PYQs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
            {products?.map((item) => {
              return <ProductCard product={item} key={item?.id} />;
            })}
            {(!products || products.length === 0) && (
              <p className="text-gray-500 col-span-full text-center py-10">No books found in this category</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
