import { ProductCard } from "@/app/components/Products";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { getProductsByCollection } from "@/lib/firestore/products/read_server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { collectionId } = params;
  const collection = await getCollection({ id: collectionId });

  return {
    title: `${collection?.title ?? "Collection"} | Score 100 Books`,
    description: collection?.subTitle ?? "",
    openGraph: {
      images: collection?.imageURL ? [collection?.imageURL] : [],
    },
  };
}

export default async function Page({ params }) {
  const { collectionId } = params;
  const collection = await getCollection({ id: collectionId });
  
  if (!collection) {
    notFound();
  }
  
  const products = await getProductsByCollection({ collectionId: collection.id });
  
  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[900px] p-5">
        <div className="w-full flex justify-center">
          <img className="h-[110px]" src={collection?.imageURL} alt="" />
        </div>
        <h1 className="text-center font-semibold text-4xl">
          {collection?.title}
        </h1>
        <h1 className="text-center text-gray-500">{collection?.subTitle}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
          {products?.map((product) => {
            return <ProductCard product={product} key={product?.id} />;
          })}
          {(!products || products.length === 0) && (
            <p className="text-gray-500 col-span-full text-center py-10">No books found in this collection</p>
          )}
        </div>
      </div>
    </main>
  );
}
