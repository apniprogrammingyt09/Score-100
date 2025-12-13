import { ProductCard } from "@/app/components/Products";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getProductsByBrand } from "@/lib/firestore/products/read_server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { boardId } = params;
  const brand = await getBrand({ id: boardId });

  return {
    title: `${brand?.name ?? "Board"} Books | Score 100`,
    description: `Score 100 Question Bank Books for ${brand?.name ?? "Board"} - Previous Year Papers, Solved PYQs, Revision Notes`,
    openGraph: {
      images: brand?.imageURL ? [brand?.imageURL] : [],
    },
  };
}

export default async function Page({ params }) {
  const { boardId } = params;
  const brand = await getBrand({ id: boardId });
  
  if (!brand) {
    notFound();
  }
  
  // Use the actual brand ID from the database
  const products = await getProductsByBrand({ brandId: brand.id });
  
  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[900px] p-5">
        <div className="flex flex-col items-center gap-3">
          {brand?.imageURL && (
            <img src={brand.imageURL} alt={brand.name} className="h-20 object-contain" />
          )}
          <h1 className="text-center font-semibold text-4xl">{brand?.name} Books</h1>
          <p className="text-gray-500 text-center">
            Score 100 Question Bank Books for {brand?.name} Board Exams
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
          {(!products || products.length === 0) && (
            <p className="text-gray-500 col-span-full text-center py-10">
              No books found for {brand?.name}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
