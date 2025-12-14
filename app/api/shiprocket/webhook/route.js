import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const webhookData = await request.json();
    
    // Extract order ID and status from webhook
    const { order_id, current_status, awb_code } = webhookData;
    
    if (!order_id) {
      return Response.json({ error: 'Order ID not found' }, { status: 400 });
    }

    // Find the order in Firestore using shiprocketOrderId
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('shiprocketOrderId', '==', order_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the order status
    const orderDoc = querySnapshot.docs[0];
    const updateData = {
      timestampStatusUpdate: Timestamp.now(),
    };

    // Map Shiprocket status to our status
    const statusMapping = {
      'NEW': 'accepted',
      'PICKUP_SCHEDULED': 'pickup_scheduled',
      'PICKED_UP': 'picked_up',
      'IN_TRANSIT': 'in_transit',
      'OUT_FOR_DELIVERY': 'out_for_delivery',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
      'RTO': 'returned',
    };

    if (statusMapping[current_status]) {
      updateData.status = statusMapping[current_status];
    }

    if (awb_code) {
      updateData.awbCode = awb_code;
    }

    await updateDoc(doc(db, 'orders', orderDoc.id), updateData);

    return Response.json({ 
      success: true, 
      message: 'Order status updated successfully' 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}