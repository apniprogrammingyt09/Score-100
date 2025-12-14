"use client";

import { useOrder } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@nextui-org/react";
import { useParams } from "next/navigation";
import ChangeOrderStatus from "./components/ChangeStatus";

export default function Page() {
  const { orderId } = useParams();
  const { data: order, error, isLoading } = useOrder({ id: orderId });

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <>{error}</>;
  }
  const totalAmount = order?.checkout?.line_items?.reduce((prev, curr) => {
    // New structure (Razorpay orders)
    if (curr?.price) {
      return prev + (curr?.price * curr?.quantity);
    }
    // Old structure (Stripe-like orders)
    if (curr?.price_data?.unit_amount) {
      return prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity;
    }
    return prev;
  }, 0);

  let address = {};
  try {
    // Try parsing from metadata first (Razorpay orders)
    if (order?.checkout?.metadata?.address) {
      address = JSON.parse(order?.checkout?.metadata?.address);
    }
    // Fallback to direct address field
    else if (order?.checkout?.address) {
      address = order?.checkout?.address;
    }
    // Additional fallback for different storage formats
    else {
      address = {
        fullName: order?.checkout?.customer_details?.name || '',
        email: order?.checkout?.customer_details?.email || '',
        mobile: order?.checkout?.customer_details?.phone || '',
        addressLine1: order?.checkout?.shipping?.address?.line1 || '',
        addressLine2: order?.checkout?.shipping?.address?.line2 || '',
        city: order?.checkout?.shipping?.address?.city || '',
        state: order?.checkout?.shipping?.address?.state || '',
        pincode: order?.checkout?.shipping?.address?.postal_code || '',
        orderNote: order?.checkout?.metadata?.orderNote || ''
      };
    }
  } catch (error) {
    console.error('Error parsing address:', error);
    address = {};
  }

  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <ChangeOrderStatus order={order} />
      </div>
      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <h3 className="bg-violet-100 text-violet-900 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.paymentMode}
            </h3>
            <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.status ?? "pending"}
            </h3>
            <h3 className="text-green-600">₹ {totalAmount}</h3>
          </div>
          <h4 className="text-gray-600 text-xs">
            {order?.timestampCreate?.toDate()?.toString()}
          </h4>
        </div>
        <div className="flex flex-col gap-3">
          {order?.checkout?.line_items?.map((product, index) => {
            // Handle both old and new structures
            const productName = product?.name || product?.price_data?.product_data?.name;
            const productImage = product?.image || product?.price_data?.product_data?.images?.[0];
            const productPrice = product?.price || (product?.price_data?.unit_amount / 100);
            const productFormat = product?.format;
            
            return (
              <div key={index} className="flex gap-2 items-center">
                <img
                  className="h-10 w-10 rounded-lg"
                  src={productImage}
                  alt="Product Image"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="">{productName}</h1>
                    {productFormat && (
                      <span className={`text-xs rounded-lg px-2 py-1 ${
                        productFormat === "ebook" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-orange-100 text-orange-800"
                      }`}>
                        {productFormat === "ebook" ? "eBook" : "Physical"}
                      </span>
                    )}
                  </div>
                  <h1 className="text-gray-500 text-xs">
                    ₹ {productPrice} <span>X</span>{" "}
                    <span>{product?.quantity?.toString()}</span>
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h1 className="text-2xl font-semibold">Address</h1>
      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <table>
          <tbody>
            <tr>
              <td className="font-medium py-2 pr-4">Full Name</td>
              <td className="py-2">{address?.fullName || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Mobile</td>
              <td className="py-2">{address?.mobile || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Email</td>
              <td className="py-2">{address?.email || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Address Line 1</td>
              <td className="py-2">{address?.addressLine1 || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Address Line 2</td>
              <td className="py-2">{address?.addressLine2 || '-'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Pincode</td>
              <td className="py-2">{address?.pincode || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">City</td>
              <td className="py-2">{address?.city || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">State</td>
              <td className="py-2">{address?.state || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-medium py-2 pr-4">Notes</td>
              <td className="py-2">{address?.orderNote || address?.note || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </main>
  );
}
