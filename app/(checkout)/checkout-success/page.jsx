import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";
import SuccessMessage from "./components/SuccessMessage";
import EbookDownloads from "./components/EbookDownloads";

const fetchCheckoutSession = async (checkoutId, uid) => {
  // Fetch checkout directly using uid from URL
  const doc = await adminDB
    .doc(`users/${uid}/checkout_sessions/${checkoutId}`)
    .get();

  if (!doc.exists) {
    throw new Error("Checkout session not found");
  }

  const checkoutData = doc.data();
  
  // Verify payment is completed
  if (checkoutData.status !== "paid") {
    throw new Error("Payment not completed");
  }

  return checkoutData;
};

const processOrder = async ({ checkout }) => {
  const orderId = checkout?.paymentId || checkout?.id;
  const order = await adminDB.doc(`orders/${orderId}`).get();
  if (order.exists) {
    return false; // Order already processed
  }
  const uid = checkout?.uid;

  await adminDB.doc(`orders/${orderId}`).set({
    checkout: checkout,
    uid: uid,
    id: orderId,
    paymentMode: "prepaid",
    status: "pending",
    timestampCreate: admin.firestore.Timestamp.now(),
  });

  const productList = checkout?.line_items?.map((item) => {
    return {
      productId: item?.productId,
      quantity: item?.quantity,
    };
  });

  const user = await adminDB.doc(`users/${uid}`).get();

  // Remove purchased items from cart
  const productIdsList = productList?.map((item) => item?.productId);
  const currentCarts = user?.data()?.carts ?? [];
  
  const newCartList = currentCarts.filter((cartItem) => {
    const cartProductId = cartItem?.id?.replace(/-ebook$/, "");
    return !productIdsList.includes(cartProductId);
  });

  await adminDB.doc(`users/${uid}`).set(
    {
      carts: newCartList,
    },
    { merge: true }
  );

  // Update product order counts
  const batch = adminDB.batch();

  productList?.forEach((item) => {
    if (item?.productId) {
      batch.update(adminDB.doc(`products/${item?.productId}`), {
        orders: admin.firestore.FieldValue.increment(item?.quantity ?? 1),
      });
    }
  });

  await batch.commit();
  return true;
};

export default async function Page({ searchParams }) {
  const { checkout_id, uid } = searchParams;
  
  if (!checkout_id || !uid) {
    throw new Error("Invalid checkout URL");
  }
  
  // Fetch checkout session directly using uid from URL
  const checkout = await fetchCheckoutSession(checkout_id, uid);

  const result = await processOrder({ checkout });

  // Extract eBooks from the order with order info for secure download
  const orderId = checkout?.paymentId || checkout?.id;
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
        
        {/* eBook Downloads Section */}
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
