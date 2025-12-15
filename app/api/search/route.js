import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/firestore/products/read_server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await searchProducts(query);
    
    return NextResponse.json({ 
      products,
      total: products.length,
      query 
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}