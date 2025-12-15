import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { orderData, customerEmail, customerName } = await request.json();

    const orderItems = orderData.checkout?.line_items?.map(item => {
      const name = item?.name || item?.price_data?.product_data?.name;
      const price = item?.price || (item?.price_data?.unit_amount / 100);
      const format = item?.format === "ebook" ? "eBook" : "Physical";
      return `${name} (${format}) - ₹${price} x ${item?.quantity}`;
    }).join('\n');

    const totalAmount = orderData.checkout?.line_items?.reduce((prev, curr) => {
      if (curr?.price) return prev + (curr?.price * curr?.quantity);
      if (curr?.price_data?.unit_amount) return prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity;
      return prev;
    }, 0);

    // Customer notification
    const customerMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: customerEmail,
      subject: `🎉 Order Confirmed - Score 100 Books`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Score 100 Books</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Your Trusted Learning Partner</p>
            </div>
            
            <!-- Success Message -->
            <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa;">
              <div style="background-color: #28a745; color: white; padding: 15px; border-radius: 50px; display: inline-block; margin-bottom: 20px;">
                <span style="font-size: 24px;">✓</span>
              </div>
              <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Thank you ${customerName}, your order has been successfully placed.</p>
            </div>
            
            <!-- Order Details -->
            <div style="padding: 30px 20px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📋 Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-weight: 500;">Order ID:</td>
                    <td style="padding: 8px 0; color: #495057; font-weight: bold; text-align: right;">#${orderData.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-weight: 500;">Payment Mode:</td>
                    <td style="padding: 8px 0; color: #495057; text-align: right;">
                      <span style="background-color: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">${orderData.paymentMode}</span>
                    </td>
                  </tr>
                  <tr style="border-top: 1px solid #dee2e6;">
                    <td style="padding: 12px 0; color: #495057; font-weight: bold; font-size: 18px;">Total Amount:</td>
                    <td style="padding: 12px 0; color: #28a745; font-weight: bold; font-size: 20px; text-align: right;">₹${totalAmount}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Items -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📚 Your Books</h3>
                ${orderData.checkout?.line_items?.map(item => {
                  const name = item?.name || item?.price_data?.product_data?.name;
                  const price = item?.price || (item?.price_data?.unit_amount / 100);
                  const format = item?.format === "ebook" ? "eBook" : "Physical";
                  const formatColor = item?.format === "ebook" ? "#17a2b8" : "#fd7e14";
                  return `
                    <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #ffffff;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                          <h4 style="margin: 0 0 5px 0; color: #495057; font-size: 16px;">${name}</h4>
                          <span style="background-color: ${formatColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">${format}</span>
                        </div>
                        <div style="text-align: right;">
                          <div style="color: #6c757d; font-size: 14px;">₹${price} × ${item?.quantity}</div>
                          <div style="color: #495057; font-weight: bold; font-size: 16px;">₹${price * item?.quantity}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
              
              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚀 What's Next?</h3>
                <p style="margin: 0; opacity: 0.9; line-height: 1.5;">We'll send you tracking information once your order is shipped. For eBooks, check your email for download links!</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">Need help? Contact us at <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #667eea; text-decoration: none;">${process.env.SMTP_EMAIL}</a></p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">© 2025 Score 100 Books. All rights reserved.</p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    // Admin notification
    const adminMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `New Order Received - ${orderData.id}`,
      html: `
        <h2>New Order Alert</h2>
        <p>A new order has been placed.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Payment Mode:</strong> ${orderData.paymentMode}</p>
        
        <h3>Items Ordered:</h3>
        <pre>${orderItems}</pre>
        
        <p>Please process this order in the admin panel.</p>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    return Response.json({ success: true, message: 'Notifications sent successfully' });

  } catch (error) {
    console.error('Email notification error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}