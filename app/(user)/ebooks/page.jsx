"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@nextui-org/react";
import { Book, Download, FileText, Smartphone, Calendar, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { user } = useAuth();
  const { data: orders, error, isLoading } = useOrders({ uid: user?.uid });

  // Extract all purchased eBooks from orders
  const purchasedEbooks = [];
  
  orders?.forEach((order) => {
    if (order?.status !== "cancelled") {
      // Check line_items in checkout object
      const lineItems = order?.checkout?.line_items || [];
      
      lineItems.forEach((item) => {
        // Check if it's an eBook (format === "ebook")
        if (item?.format === "ebook") {
          purchasedEbooks.push({
            orderId: order?.id,
            orderDate: order?.timestampCreate,
            productId: item?.productId,
            name: item?.name || item?.price_data?.product_data?.name,
            image: item?.image || item?.price_data?.product_data?.images?.[0],
            ebookUrl: item?.ebookUrl,
            price: item?.price || item?.price_data?.unit_amount / 100,
          });
        }
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <main className="flex flex-col gap-6 p-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <Book className="text-emerald-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">My eBooks</h1>
          <p className="text-gray-500 text-sm">Download your purchased digital books</p>
        </div>
      </div>

      {purchasedEbooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 bg-gray-50 rounded-2xl">
          <div className="p-6 bg-white rounded-full shadow-sm">
            <FileText className="text-gray-300" size={48} />
          </div>
          <h2 className="text-xl font-medium text-gray-600">No eBooks Yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            You haven't purchased any eBooks yet. Browse our collection and get instant access to digital books.
          </p>
          <Link href="/">
            <button className="mt-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <ShoppingBag size={18} />
              Browse eBooks
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {purchasedEbooks.map((ebook, index) => (
            <div
              key={`${ebook.orderId}-${ebook.productId}-${index}`}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Book Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={ebook.image}
                  alt={ebook.name}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm"
                />
                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1.5">
                  <Smartphone size={12} className="text-white" />
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                    {ebook.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      PDF eBook
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {ebook.orderDate?.toDate
                        ? ebook.orderDate.toDate().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ebook.orderDate?.seconds
                        ? new Date(ebook.orderDate.seconds * 1000).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-3 flex items-center gap-3">
                  {ebook.ebookUrl ? (
                    <a
                      href={ebook.ebookUrl ? `/api/download-ebook?url=${encodeURIComponent(ebook.ebookUrl)}&filename=${encodeURIComponent(ebook.name + '.pdf')}` : '#'}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Download size={18} />
                      Download PDF
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 rounded-lg font-medium">
                      <AlertCircle size={18} />
                      Download coming soon
                    </div>
                  )}
                  <span className="text-sm text-gray-400">
                    ₹{ebook.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      {purchasedEbooks.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="font-medium text-blue-800 mb-2"> Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your eBooks are available for unlimited downloads</li>
            <li>• You can read PDFs on any device - phone, tablet, or computer</li>
            <li>• For best experience, use a PDF reader app</li>
          </ul>
        </div>
      )}
    </main>
  );
}
