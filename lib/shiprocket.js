// Shiprocket integration helper functions

export const createShiprocketOrder = async (orderData) => {
  try {
    const response = await fetch('/api/shiprocket/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create Shiprocket order');
    }

    return result;
  } catch (error) {
    console.error('Shiprocket order creation failed:', error);
    throw error;
  }
};

export const formatOrderForShiprocket = (order, userAddress) => {
  return {
    orderId: order.id,
    customerName: userAddress.name || order.customerName,
    customerLastName: userAddress.lastName || '',
    address: userAddress.address1,
    address2: userAddress.address2 || '',
    city: userAddress.city,
    pincode: userAddress.pincode,
    state: userAddress.state,
    email: order.email,
    phone: userAddress.phone,
    items: order.checkout.line_items.map(item => ({
      id: item.productId,
      name: item.title,
      sku: item.productId,
      quantity: item.quantity,
      price: item.salePrice
    })),
    paymentMethod: order.paymentMode,
    shippingCharges: order.deliveryCharge || 0,
    discount: order.discount || 0,
    total: order.totalAmount,
    dimensions: {
      length: 15,
      breadth: 10,
      height: 5,
      weight: 0.5
    }
  };
};