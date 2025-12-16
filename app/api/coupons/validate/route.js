import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    
    if (!code) {
      return Response.json({ success: false, error: 'Coupon code is required' });
    }

    const couponDoc = await getDoc(doc(db, `coupons/${code.toUpperCase()}`));
    
    if (!couponDoc.exists()) {
      return Response.json({ success: false, error: 'Invalid coupon code' });
    }

    const coupon = couponDoc.data();
    const now = new Date();
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return Response.json({ success: false, error: 'Coupon is not active' });
    }
    
    // Check expiry date
    if (coupon.expiryDate && coupon.expiryDate.toDate() < now) {
      return Response.json({ success: false, error: 'Coupon has expired' });
    }
    
    // Check minimum order value
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return Response.json({ 
        success: false, 
        error: `Minimum order value of ₹${coupon.minOrderValue} required` 
      });
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return Response.json({ success: false, error: 'Coupon usage limit exceeded' });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return Response.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount)
      }
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}