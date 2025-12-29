"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@nextui-org/react";
import { Book, Download, Smartphone, FileText } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: orders, error, isLoading } = useOrders({ uid: user?.uid });

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center py-48">
        <CircularProgress aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <h1 className="text-xl font-semibold">Please log in to view your account</h1>
        <Link href="/login">
          <button className="bg-violet-900 text-white px-6 py-2 rounded-lg">
            Login
          </button>
        </Link>
      </div>
    );
  }

  if (error) {
    return <>{error}</>;
  }

  // Check if user has any eBooks
  const hasEbooks = orders?.some((order) =>
    order?.checkout?.line_items?.some(
      (item) => item?.format === "ebook" && item?.ebookUrl
    )
  );

  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        {hasEbooks && (
          <Link href="/ebooks">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Book size={16} />
              My eBooks Library
            </button>
          </Link>
        )}
      </div>
      {(!orders || orders?.length === 0) && (
        <div className="flex flex-col items-center justify-center gap-3 py-11">
          <div className="flex justify-center">
            <img className="h-44" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1>You have no order</h1>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {orders?.map((item, orderIndex) => {
          const totalAmount = item?.checkout?.line_items?.reduce(
            (prev, curr) => {
              const price = curr?.price || curr?.price_data?.unit_amount / 100;
              return prev + price * (curr?.quantity || 1);
            },
            0
          );
          const orderEbooks = item?.checkout?.line_items?.filter(
            (p) => p?.format === "ebook" && p?.ebookUrl
          );
          return (
            <div key={item?.id ?? orderIndex} className="flex flex-col gap-2 border rounded-lg p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <h3 className="font-medium">#{orderIndex + 1}</h3>
                  <h3 className="bg-violet-100 text-violet-900 text-xs rounded-lg px-2 py-1 uppercase">
                    {item?.paymentMode}
                  </h3>
                  <h3 className={`text-xs rounded-lg px-2 py-1 uppercase ${
                    item?.checkout?.hasEbooks && item?.paymentMode === 'PREPAID' 
                      ? 'bg-green-100 text-green-500' 
                      : item?.status === 'completed' || item?.status === 'delivered'
                      ? 'bg-green-100 text-green-500'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {item?.checkout?.hasEbooks && item?.paymentMode === 'PREPAID' 
                      ? 'DELIVERED' 
                      : item?.status ?? "pending"}
                  </h3>
                  {item?.shiprocketOrderId && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/shiprocket/generate-invoice', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ shiprocketOrderId: item.shiprocketOrderId })
                          });
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `invoice-${item.shiprocketOrderId}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          }
                        } catch (error) {
                          console.error('Failed to download invoice:', error);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FileText size={10} />
                      Invoice
                    </button>
                  )}
                  {item?.checkout?.hasEbooks && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs rounded-lg px-2 py-1 flex items-center gap-1">
                      <Smartphone size={10} />
                      eBook
                    </span>
                  )}
                  <h3 className="text-green-600 font-semibold">₹{totalAmount}</h3>
                </div>

                <h4 className="text-gray-600 text-xs">
                  {item?.timestampCreate?.toDate ? 
                    item?.timestampCreate?.toDate()?.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : 
                    (item?.timestampCreate ? new Date(item.timestampCreate.seconds * 1000).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : '')}
                </h4>
              </div>
              <div className="space-y-2">
                {item?.checkout?.line_items?.map((product, productIndex) => {
                  const isEbook = product?.format === "ebook";
                  const productName = product?.name || product?.price_data?.product_data?.name;
                  const productImage = product?.image || product?.price_data?.product_data?.images?.[0];
                  const productPrice = product?.price || product?.price_data?.unit_amount / 100;
                  
                  return (
                    <div key={productIndex} className="flex gap-3 items-center p-2 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <img
                          className="h-12 w-10 object-cover rounded-lg"
                          src={productImage}
                          alt="Product"
                        />
                        {isEbook && (
                          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                            <Smartphone size={8} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-sm font-medium line-clamp-1">{productName}</h1>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            isEbook 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-indigo-100 text-indigo-700"
                          }`}>
                            {isEbook ? "eBook" : "Hard Copy"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ₹{productPrice} × {product?.quantity || 1}
                          </span>
                        </div>
                      </div>
                      {isEbook && product?.ebookUrl && (
                        <a
                          href={product?.ebookUrl ? `/api/download-ebook?url=${encodeURIComponent(product.ebookUrl)}&filename=${encodeURIComponent(product.name + '.pdf')}` : '#'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Download size={12} />
                          Download
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
