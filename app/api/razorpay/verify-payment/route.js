import crypto from "crypto";
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase_admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      uid,
      checkoutId,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update checkout session status and store payment info
      if (uid && checkoutId) {
        // Get checkout session to check for coupon
        const checkoutDoc = await adminDB.doc(`users/${uid}/checkout_sessions/${checkoutId}`).get();
        const checkoutData = checkoutDoc.data();
        
        await adminDB.doc(`users/${uid}/checkout_sessions/${checkoutId}`).update({
          status: "paid",
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          paidAt: new Date(),
        });

        // Update coupon usage count if coupon was used
        if (checkoutData?.coupon?.code) {
          await adminDB.doc(`coupons/${checkoutData.coupon.code}`).update({
            usedCount: FieldValue.increment(1)
          });
        }

        // Update stock for physical products
        if (checkoutData?.line_items) {
          for (const item of checkoutData.line_items) {
            if (item.format !== "ebook") {
              await adminDB.doc(`products/${item.productId}`).update({
                stock: FieldValue.increment(-item.quantity)
              });
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
