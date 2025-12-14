import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { orderId, packageDetails, orderData } = await request.json();

    // Authenticate with Shiprocket
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      })
    });

    const authData = await authResponse.json();
    if (!authResponse.ok) {
      throw new Error(authData.message || 'Authentication failed');
    }

    // Create order in Shiprocket
    const shiprocketOrderData = {
      order_id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: orderData.billing_customer_name,
      billing_last_name: orderData.billing_last_name || "",
      billing_address: orderData.billing_address,
      billing_city: orderData.billing_city,
      billing_pincode: parseInt(orderData.billing_pincode),
      billing_state: orderData.billing_state,
      billing_country: "India",
      billing_email: orderData.billing_email,
      billing_phone: parseInt(orderData.billing_phone),
      shipping_is_billing: true,
      order_items: orderData.order_items,
      payment_method: "Prepaid",
      sub_total: orderData.sub_total,
      length: parseFloat(packageDetails.length),
      breadth: parseFloat(packageDetails.breadth),
      height: parseFloat(packageDetails.height),
      weight: parseFloat(packageDetails.weight)
    };

    const orderResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      },
      body: JSON.stringify(shiprocketOrderData)
    });

    const shiprocketOrder = await orderResponse.json();
    if (!orderResponse.ok) {
      throw new Error(shiprocketOrder.message || 'Failed to create order');
    }

    // Update order in Firestore
    await updateDoc(doc(db, `orders/${orderId}`), {
      status: 'accepted',
      shiprocketOrderId: shiprocketOrder.order_id,
      shiprocketShipmentId: shiprocketOrder.shipment_id,
      packageDetails: packageDetails,
      timestampAccepted: Timestamp.now(),
    });

    return Response.json({ 
      success: true, 
      shiprocketOrder,
      message: 'Order created in Shiprocket successfully' 
    });

  } catch (error) {
    console.error('Shiprocket order creation error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}