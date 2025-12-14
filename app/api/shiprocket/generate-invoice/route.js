import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { shiprocketOrderId } = await request.json();

    if (!shiprocketOrderId) {
      return NextResponse.json({ error: 'Shiprocket Order ID required' }, { status: 400 });
    }

    // Get Shiprocket token
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/api/shiprocket/auth`, {
      method: 'POST',
    });
    const { token } = await authResponse.json();

    if (!token) {
      throw new Error('Failed to authenticate with Shiprocket');
    }

    // Generate invoice
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/print/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: [parseInt(shiprocketOrderId)]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shiprocket invoice error:', errorText);
      throw new Error('Failed to generate invoice');
    }

    const invoiceData = await response.json();
    
    if (!invoiceData.is_invoice_created || !invoiceData.invoice_url) {
      throw new Error('Invoice not available for this order');
    }

    // Fetch the PDF from the invoice URL
    const pdfResponse = await fetch(invoiceData.invoice_url);
    
    if (!pdfResponse.ok) {
      throw new Error('Failed to download invoice PDF');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${shiprocketOrderId}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}