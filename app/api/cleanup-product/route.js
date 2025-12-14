import { adminDB } from '@/lib/firebase_admin';

export async function POST(request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get all users
    const usersSnapshot = await adminDB.collection('users').get();
    
    const batch = adminDB.batch();
    let cleanupCount = 0;

    // Remove product from all users' carts and favorites
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Remove from cart
      const cartRef = adminDB.collection(`users/${userId}/cart`).doc(productId);
      batch.delete(cartRef);
      
      // Remove eBook version from cart
      const ebookCartRef = adminDB.collection(`users/${userId}/cart`).doc(`${productId}-ebook`);
      batch.delete(ebookCartRef);
      
      // Remove from favorites
      const favRef = adminDB.collection(`users/${userId}/favorites`).doc(productId);
      batch.delete(favRef);
      
      // Remove eBook version from favorites
      const ebookFavRef = adminDB.collection(`users/${userId}/favorites`).doc(`${productId}-ebook`);
      batch.delete(ebookFavRef);
      
      cleanupCount += 4; // 4 potential deletions per user
    }

    // Execute all deletions
    await batch.commit();

    return Response.json({ 
      success: true, 
      message: `Product removed from all user carts and favorites`,
      cleanupCount 
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}