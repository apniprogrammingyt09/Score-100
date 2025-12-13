"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/firestore/checkout/write";
import { Button } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { CheckSquare2Icon, CreditCard, Book, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout({ productList, hasEbooks, hasPhysical }) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleAddress = (key, value) => {
    setAddress({ ...(address ?? {}), [key]: value });
  };

  // Calculate total price based on format
  const totalPrice = productList?.reduce((prev, curr) => {
    const price = curr?.format === "ebook" 
      ? (curr?.product?.ebookSalePrice || curr?.product?.salePrice)
      : curr?.product?.salePrice;
    return prev + curr?.quantity * price;
  }, 0);

  const handleRazorpayPayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder({
        uid: user?.uid,
        products: productList,
        address: address,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "Score 100 Books",
        description: "Purchase from Score 100 Books",
        image: "/logo.png",
        order_id: orderData.razorpayOrderId,
        // Enable all payment methods
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi", flows: ["collect", "intent", "qr"] }
                ]
              },
              cards: {
                name: "Cards",
                instruments: [
                  { method: "card" }
                ]
              },
              netbanking: {
                name: "Net Banking",
                instruments: [
                  { method: "netbanking" }
                ]
              },
              wallet: {
                name: "Wallets",
                instruments: [
                  { method: "wallet" }
                ]
              }
            },
            sequence: ["block.upi", "block.cards", "block.netbanking", "block.wallet"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function (response) {
          try {
            // Verify payment
            const result = await verifyRazorpayPayment({
              uid: user?.uid,
              checkoutId: orderData.checkoutId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              confetti();
              toast.success("Payment Successful!");
              router.push(`/checkout-success?checkout_id=${orderData.checkoutId}&uid=${user?.uid}`);
            }
          } catch (error) {
            toast.error(error?.message || "Payment verification failed");
            router.push(`/checkout-failed?checkout_id=${orderData.checkoutId}`);
          }
        },
        prefill: {
          name: address?.fullName || "",
          email: address?.email || user?.email || "",
          contact: address?.mobile || "",
        },
        notes: {
          address: `${address?.addressLine1}, ${address?.city}, ${address?.state} - ${address?.pincode}`,
        },
        theme: {
          color: "#312e81", // indigo-900
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error) {
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error("Price should be greater than 0");
      }
      
      // Only require address for physical products
      if (hasPhysical && (!address?.fullName || !address?.mobile || !address?.addressLine1)) {
        throw new Error("Please Fill All Address Details for Physical Books");
      }
      
      // For eBook only orders, just need email
      if (!hasPhysical && hasEbooks && !address?.email) {
        throw new Error("Please provide your email for eBook delivery");
      }

      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      await handleRazorpayPayment();
    } catch (error) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row gap-3">
      {/* Address Section - Only show full form for physical products */}
      <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
        <h1 className="text-xl">
          {hasPhysical ? "Shipping Address" : "Contact Information"}
        </h1>
        <div className="flex flex-col gap-2">
          {hasPhysical && (
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="Full Name"
              value={address?.fullName ?? ""}
              onChange={(e) => {
                handleAddress("fullName", e.target.value);
              }}
              className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            />
          )}
          {hasPhysical && (
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Mobile Number"
              value={address?.mobile ?? ""}
              onChange={(e) => {
                handleAddress("mobile", e.target.value);
              }}
              className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            />
          )}
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email (for order confirmation & eBook delivery)"
            value={address?.email ?? ""}
            onChange={(e) => {
              handleAddress("email", e.target.value);
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
          {hasPhysical && (
            <>
              <input
                type="text"
                id="address-line-1"
                name="address-line-1"
                placeholder="Enter Address Line 1"
                value={address?.addressLine1 ?? ""}
                onChange={(e) => {
                  handleAddress("addressLine1", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
              <input
                type="text"
                id="address-line-2"
                name="address-line-2"
                placeholder="Enter Address Line 2"
                value={address?.addressLine2 ?? ""}
                onChange={(e) => {
                  handleAddress("addressLine2", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
              <input
                type="number"
                id="pincode"
                name="pincode"
                placeholder="Enter Pincode"
                value={address?.pincode ?? ""}
                onChange={(e) => {
                  handleAddress("pincode", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                value={address?.city ?? ""}
                onChange={(e) => {
                  handleAddress("city", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Enter State"
                value={address?.state ?? ""}
                onChange={(e) => {
                  handleAddress("state", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
              <textarea
                type="text"
                id="delivery-notes"
                name="delivery-notes"
                placeholder="Notes about your order, e.g special notes for delivery"
                value={address?.orderNote ?? ""}
                onChange={(e) => {
                  handleAddress("orderNote", e.target.value);
                }}
                className="border px-4 py-2 rounded-lg w-full focus:outline-none"
              />
            </>
          )}
          {!hasPhysical && hasEbooks && (
            <p className="text-sm text-gray-500">
              Your eBook download link will be sent to this email after payment.
            </p>
          )}
        </div>
      </section>
      <div className="flex-1 flex flex-col gap-3">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h1 className="text-xl">Products</h1>
          <div className="flex flex-col gap-2">
            {productList?.map((item, index) => {
              const isEbook = item?.format === "ebook";
              const price = isEbook 
                ? (item?.product?.ebookSalePrice || item?.product?.salePrice)
                : item?.product?.salePrice;
              return (
                <div key={index} className="flex gap-3 items-center p-2 rounded-lg bg-gray-50">
                  <div className="relative">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      src={item?.product?.featureImageURL}
                      alt=""
                    />
                    {isEbook ? (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                        <Smartphone size={10} className="text-white" />
                      </div>
                    ) : (
                      <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full p-0.5">
                        <Book size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h1 className="text-sm font-medium">{item?.product?.title}</h1>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isEbook 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {isEbook ? "eBook (PDF)" : "Hard Copy"}
                      </span>
                      <h3 className="text-green-600 font-semibold text-xs">
                        ₹{price} × {item?.quantity}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      ₹{price * item?.quantity}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between w-full items-center p-2 font-semibold border-t">
            <h1>Total</h1>
            <h1 className="text-lg">₹{totalPrice}</h1>
          </div>
        </section>
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-indigo-900">Payment</h2>
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                <CreditCard size={18} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-indigo-900">Pay Online</p>
                <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
              </div>
              <CheckSquare2Icon className="ml-auto text-indigo-500" size={20} />
            </div>
            
            {/* Payment Methods Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">UPI</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Google Pay</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">PhonePe</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Paytm</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Cards</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Net Banking</span>
              </div>
            </div>

            {hasEbooks && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
                <strong> eBook:</strong> Download link will be sent to your email instantly after payment.
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center mt-2">
            <CheckSquare2Icon className="text-indigo-500" size={16} />
            <h4 className="text-sm text-gray-600">
              I agree with the{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">terms & conditions</span>
            </h4>
          </div>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handlePlaceOrder}
            className="bg-indigo-900 text-white font-semibold py-6 rounded-full shadow-lg hover:translate-y-[-1px] transition-transform"
          >
            Pay Now • ₹{totalPrice}
          </Button>
        </section>
      </div>
    </section>
  );
}
