"use client";

import { useEffect, useState } from 'react';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";
import SuccessMessage from "./components/SuccessMessage";
import EbookDownloads from "./components/EbookDownloads";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp, updateDoc, increment } from "firebase/firestore";

export default function Page({ searchParams }) {
  const [checkout, setCheckout] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { checkout_id, uid } = searchParams;

  useEffect(() => {
    if (!checkout_id || !uid) {
      setError('Invalid checkout URL');
      setLoading(false);
      return;
    }

    const processCheckout = async () => {
      try {
        // Fetch checkout session
        const checkoutRef = doc(db, `users/${uid}/checkout_sessions/${checkout_id}`);
        const checkoutDoc = await getDoc(checkoutRef);

        if (!checkoutDoc.exists()) {
          throw new Error('Checkout session not found');
        }

        const checkoutData = checkoutDoc.data();
        
        if (checkoutData.status !== "paid") {
          throw new Error('Payment not completed');
        }

        // Process order
        const orderIdValue = checkoutData?.razorpayPaymentId || checkoutData?.id;
        const orderRef = doc(db, `orders/${orderIdValue}`);
        const orderExists = await getDoc(orderRef);
        
        if (!orderExists.exists()) {
          await setDoc(orderRef, {
            checkout: checkoutData,
            uid: uid,
            id: orderIdValue,
            paymentMode: "prepaid",
            status: "pending",
            timestampCreate: Timestamp.now(),
          });

          // Update user cart and product counts
          const productList = checkoutData?.line_items?.map((item) => ({
            productId: item?.productId,
            quantity: item?.quantity,
          }));

          const userRef = doc(db, `users/${uid}`);
          const userDoc = await getDoc(userRef);
          const productIdsList = productList?.map((item) => item?.productId);
          const currentCarts = userDoc?.data()?.carts ?? [];
          
          const newCartList = currentCarts.filter((cartItem) => {
            const cartProductId = cartItem?.id?.replace(/-ebook$/, "");
            return !productIdsList.includes(cartProductId);
          });

          await updateDoc(userRef, { carts: newCartList });

          // Update product order counts
          for (const item of productList) {
            if (item?.productId) {
              const productRef = doc(db, `products/${item.productId}`);
              await updateDoc(productRef, {
                orders: increment(item?.quantity ?? 1)
              });
            }
          }
        }

        setCheckout(checkoutData);
        setOrderId(orderIdValue);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processCheckout();
  }, [checkout_id, uid]);

  if (loading) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p>Processing your order...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const ebooks = checkout?.line_items?.filter(
    (item) => item?.format === "ebook" && item?.ebookUrl
  ).map((item) => ({
    ...item,
    orderId,
    uid,
  })) || [];

  return (
    <main>
      <Header />
      <SuccessMessage />
      <section className="min-h-screen flex flex-col gap-4 justify-center items-center px-4 py-12">
        <div className="flex justify-center w-full">
          <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Your Order Is{" "}
          <span className="font-bold text-green-600">Successfully</span> Placed
        </h1>
        
        {ebooks.length > 0 && (
          <EbookDownloads ebooks={ebooks} orderId={orderId} uid={uid} />
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-4">
          <Link href={"/account"}>
            <button className="text-violet-600 border border-violet-600 px-5 py-2 rounded-lg bg-white hover:bg-violet-50 transition-colors">
              View All Orders
            </button>
          </Link>
          {ebooks.length > 0 && (
            <Link href={"/ebooks"}>
              <button className="text-emerald-600 border border-emerald-600 px-5 py-2 rounded-lg bg-white hover:bg-emerald-50 transition-colors">
                My eBooks Library
              </button>
            </Link>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
