"use client";

import { updateOrderStatus } from "@/lib/firestore/orders/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangeOrderStatus({ order }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [dimensions, setDimensions] = useState({
    length: 15,
    breadth: 10,
    height: 5,
    weight: 0.5
  });

  const handleAcceptOrder = async () => {
    try {
      await updateOrderStatus({ id: order?.id, status: "confirmed" });
      toast.success("Order Accepted");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleCreateShipment = async () => {
    setIsLoading(true);
    try {
      console.log('Checkout address:', order.checkout?.address);
      console.log('Checkout line_items:', order.checkout?.line_items);
      
      const customerInfo = order.checkout?.address;
      const items = order.checkout?.line_items;
      
      if (!customerInfo) {
        toast.error('Order missing address information');
        return;
      }
      
      if (!items || items.length === 0) {
        toast.error('Order has no items');
        return;
      }
      
      const orderData = {
        orderId: order.id,
        customerName: customerInfo.firstName || customerInfo.name || customerInfo.fullName,
        customerLastName: customerInfo.lastName || customerInfo.surname || '',
        address: customerInfo.address || customerInfo.address1 || customerInfo.street || `${customerInfo.city}, ${customerInfo.state}`,
        address2: customerInfo.address2 || '',
        city: customerInfo.city,
        pincode: customerInfo.pincode || customerInfo.postalCode || customerInfo.zip,
        state: customerInfo.state || customerInfo.province,
        email: customerInfo.email,
        phone: customerInfo.phone || customerInfo.phoneNumber || customerInfo.mobile,
        items: items.map(item => ({
          id: item.productId,
          name: item.title || item.name,
          sku: item.productId,
          quantity: item.quantity,
          price: item.salePrice || item.price
        })),
        paymentMethod: order.paymentMode,
        shippingCharges: order.checkout.deliveryCharge || 0,
        discount: order.checkout.discount || 0,
        total: order.checkout.amount,
        dimensions
      };

      const response = await fetch('/api/shiprocket/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        await updateOrderStatus({ 
          id: order?.id, 
          status: "shipped",
          shiprocketOrderId: result.shiprocketOrderId,
          shipmentId: result.shipmentId,
          awbCode: result.awbCode,
          courierName: result.courierName
        });
        toast.success("Shipment created successfully!");
        setShowDimensions(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  if (order?.status === "pending") {
    return (
      <Button onPress={handleAcceptOrder} color="success" size="sm">
        Accept Order
      </Button>
    );
  }

  if (order?.status === "confirmed" && !order?.shiprocketOrderId) {
    return (
      <div className="space-y-4">
        {!showDimensions ? (
          <Button onPress={() => setShowDimensions(true)} color="primary" size="sm">
            Create Shipment
          </Button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold">Package Dimensions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({...dimensions, length: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0.5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Breadth (cm)</label>
                <input
                  type="number"
                  value={dimensions.breadth}
                  onChange={(e) => setDimensions({...dimensions, breadth: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0.5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({...dimensions, height: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0.5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={dimensions.weight}
                  onChange={(e) => setDimensions({...dimensions, weight: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onPress={handleCreateShipment} 
                color="primary" 
                size="sm"
                isLoading={isLoading}
              >
                Create Shipment
              </Button>
              <Button 
                onPress={() => setShowDimensions(false)} 
                variant="bordered" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (order?.shiprocketOrderId) {
    const handleGenerateInvoice = async () => {
      try {
        const response = await fetch('/api/shiprocket/generate-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shiprocketOrderId: order.shiprocketOrderId })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${order.shiprocketOrderId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success('Invoice downloaded successfully');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to generate invoice');
        }
      } catch (error) {
        toast.error('Failed to generate invoice');
      }
    };

    return (
      <div className="text-sm space-y-2">
        <div className="font-semibold text-green-600">Shipped</div>
        <div>AWB: {order.awbCode}</div>
        <div>Courier: {order.courierName}</div>
        <Button 
          onPress={handleGenerateInvoice}
          size="sm"
          color="primary"
          variant="bordered"
        >
          Generate Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">
      Status: {order?.status || "pending"}
    </div>
  );
}
