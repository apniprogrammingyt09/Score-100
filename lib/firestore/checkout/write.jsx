import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

export const createRazorpayOrder = async ({ uid, products, address }) => {
  // Calculate total amount based on format (eBook vs physical)
  const totalAmount = products.reduce((total, item) => {
    const isEbook = item?.format === "ebook";
    const price = isEbook 
      ? (item?.product?.ebookSalePrice || item?.product?.salePrice)
      : item?.product?.salePrice;
    return total + (price * (item?.quantity ?? 1));
  }, 0);

  const checkoutId = doc(collection(db, `ids`)).id;

  // Create Razorpay order via API
  const response = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: totalAmount,
      currency: "INR",
      receipt: checkoutId,
      notes: {
        checkoutId,
        uid,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Razorpay order");
  }

  const orderData = await response.json();

  // Store checkout session in Firestore
  const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);

  let line_items = [];

  products.forEach((item) => {
    const isEbook = item?.format === "ebook";
    const price = isEbook 
      ? (item?.product?.ebookSalePrice || item?.product?.salePrice)
      : item?.product?.salePrice;
    
    // Get base product ID (remove -ebook suffix if present)
    const baseProductId = item?.id?.replace(/-ebook$/, "");
    
    line_items.push({
      productId: baseProductId,
      format: item?.format || "physical",
      name: item?.product?.title ?? "",
      description: item?.product?.shortDescription ?? "",
      image: item?.product?.featureImageURL ?? "",
      price: price,
      quantity: item?.quantity ?? 1,
      ebookUrl: isEbook ? (item?.product?.ebookUrl || "") : null,
    });
  });

  // Check if order contains eBooks
  const hasEbooks = products.some((item) => item?.format === "ebook");
  const hasPhysical = products.some((item) => item?.format !== "ebook");

  await setDoc(ref, {
    id: checkoutId,
    razorpayOrderId: orderData.orderId,
    amount: totalAmount,
    currency: "INR",
    line_items: line_items,
    address: address,
    uid: uid,
    status: "pending",
    hasEbooks: hasEbooks,
    hasPhysical: hasPhysical,
    createdAt: Timestamp.now(),
  });

  return {
    checkoutId,
    razorpayOrderId: orderData.orderId,
    amount: totalAmount,
    currency: "INR",
  };
};

export const verifyRazorpayPayment = async ({
  uid,
  checkoutId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  // Verify payment via API
  const response = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Payment verification failed");
  }

  // Update checkout session with payment details
  const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);
  await setDoc(
    ref,
    {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: Timestamp.now(),
    },
    { merge: true }
  );

  // Get updated checkout data for notifications
  const checkoutDoc = await getDoc(ref);
  const checkoutData = checkoutDoc.data();

  // Send email notifications
  try {
    await fetch('/api/send-order-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderData: { id: checkoutId, checkout: checkoutData, paymentMode: 'razorpay' },
        customerEmail: checkoutData?.address?.email,
        customerName: checkoutData?.address?.fullName || 'Customer'
      })
    });
  } catch (error) {
    console.error('Failed to send notifications:', error);
  }

  return {
    success: true,
    checkoutId,
    paymentId: razorpay_payment_id,
  };
};

export const createCheckoutAndGetURL = async ({ uid, products, address }) => {
  const checkoutId = doc(collection(db, `ids`)).id;

  const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);

  let line_items = [];

  products.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.product?.title ?? "",
          description: item?.product?.shortDescription ?? "",
          images: [
            item?.product?.featureImageURL ??
              `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png`,
          ],
          metadata: {
            productId: item?.id,
          },
        },
        unit_amount: item?.product?.salePrice * 100,
      },
      quantity: item?.quantity ?? 1,
    });
  });

  await setDoc(ref, {
    id: checkoutId,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: line_items,
    metadata: {
      checkoutId: checkoutId,
      uid: uid,
      address: JSON.stringify(address),
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
  });

  await new Promise((res) => setTimeout(res, 2000));

  const checkoutSession = await getDoc(ref);

  if (!checkoutSession?.exists()) {
    throw new Error("Checkout Session Not Found");
  }

  if (checkoutSession?.data()?.error?.message) {
    throw new Error(checkoutSession?.data()?.error?.message);
  }

  const url = checkoutSession.data()?.url;

  if (url) {
    return url;
  } else {
    await new Promise((res) => setTimeout(res, 3000));

    const checkoutSession = await getDoc(ref);

    if (checkoutSession?.data()?.error?.message) {
      throw new Error(checkoutSession?.data()?.error?.message);
    }

    if (checkoutSession.data()?.url) {
      return checkoutSession.data()?.url;
    } else {
      await new Promise((res) => setTimeout(res, 5000));

      const checkoutSession = await getDoc(ref);

      if (checkoutSession?.data()?.error?.message) {
        throw new Error(checkoutSession?.data()?.error?.message);
      }

      if (checkoutSession.data()?.url) {
        return checkoutSession.data()?.url;
      } else {
        throw new Error("Something went wrong! Please Try Again");
      }
    }
  }
};

export const createCheckoutCODAndGetId = async ({ uid, products, address }) => {
  const checkoutId = `cod_${doc(collection(db, `ids`)).id}`;

  const ref = doc(db, `users/${uid}/checkout_sessions_cod/${checkoutId}`);

  let line_items = [];

  products.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.product?.title ?? "",
          description: item?.product?.shortDescription ?? "",
          images: [
            item?.product?.featureImageURL ??
              `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png`,
          ],
          metadata: {
            productId: item?.id,
          },
        },
        unit_amount: item?.product?.salePrice * 100,
      },
      quantity: item?.quantity ?? 1,
    });
  });

  await setDoc(ref, {
    id: checkoutId,
    line_items: line_items,
    metadata: {
      checkoutId: checkoutId,
      uid: uid,
      address: JSON.stringify(address),
    },
    createdAt: Timestamp.now(),
  });

  return checkoutId;
};
