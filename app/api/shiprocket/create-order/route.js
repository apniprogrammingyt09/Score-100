import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Get Shiprocket token
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const authResponse = await fetch(`${baseUrl}/api/shiprocket/auth`, {
      method: 'POST',
    });
    const { token } = await authResponse.json();

    if (!token) {
      throw new Error('Failed to authenticate with Shiprocket');
    }

    // Create order payload with exact Shiprocket format
    const now = new Date();
    const orderDate = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);
    
    console.log('Received order data:', JSON.stringify(orderData, null, 2));
    
    // Validate required data with detailed error messages
    const missing = [];
    if (!orderData.customerName) missing.push('customerName');
    if (!orderData.address) missing.push('address');
    if (!orderData.city) missing.push('city');
    if (!orderData.pincode) missing.push('pincode');
    if (!orderData.state) missing.push('state');
    if (!orderData.email) missing.push('email');
    if (!orderData.phone) missing.push('phone');
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('No items in order');
    }

    const shiprocketOrder = {
      order_id: String(orderData.orderId),
      order_date: orderDate,
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: String(orderData.customerName),
      billing_last_name: String(orderData.customerLastName),
      billing_address: String(orderData.address),
      billing_address_2: String(orderData.address2),
      billing_city: String(orderData.city),
      billing_pincode: Number(orderData.pincode),
      billing_state: String(orderData.state),
      billing_country: 'India',
      billing_email: String(orderData.email),
      billing_phone: (() => {
        const cleanPhone = String(orderData.phone).replace(/\D/g, '');
        if (cleanPhone.length === 10 && cleanPhone.match(/^[6-9]/)) {
          return Number(cleanPhone);
        }
        throw new Error('Invalid phone number format');
      })(),
      shipping_is_billing: true,
      shipping_customer_name: '',
      shipping_last_name: '',
      shipping_address: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_pincode: '',
      shipping_country: '',
      shipping_state: '',
      shipping_email: '',
      shipping_phone: '',
      order_items: orderData.items.map(item => ({
        name: String(item.name),
        sku: String(item.sku || item.id),
        units: Number(item.quantity),
        selling_price: Number(item.price),
        discount: '',
        tax: '',
        hsn: 441122
      })),
      payment_method: orderData.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      shipping_charges: Number(orderData.shippingCharges),
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: Number(orderData.discount),
      sub_total: Number(orderData.total),
      length: Number(orderData.dimensions.length),
      breadth: Number(orderData.dimensions.breadth),
      height: Number(orderData.dimensions.height),
      weight: Number(orderData.dimensions.weight)
    };

    // Create order in Shiprocket
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketOrder),
    });

    const result = await response.json();

    console.log('Shiprocket Response Status:', response.status);
    console.log('Shiprocket Response:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('Shiprocket API Error:', result);
      console.error('Sent payload:', JSON.stringify(shiprocketOrder, null, 2));
      throw new Error(result.message || result.errors || 'Failed to create Shiprocket order');
    }

    return NextResponse.json({
      success: true,
      shiprocketOrderId: result.order_id,
      shipmentId: result.shipment_id,
      awbCode: result.awb_code,
      courierName: result.courier_name,
      fullResponse: result
    });

  } catch (error) {
    console.error('Shiprocket order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}