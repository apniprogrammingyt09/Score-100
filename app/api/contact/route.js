import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send form to admin
    const adminMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: 'krish70bhagat@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send confirmation to client
    const clientMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Thank you for contacting Score 100 Books',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Score 100 Books - Contact Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Score 100 Books</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Question Bank Store</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Thank you for reaching out!</h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear <strong>${name}</strong>,</p>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        We have successfully received your message and our team will get back to you within 24 hours.
                      </p>
                      
                      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0;">
                        <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Your Message:</h3>
                        <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.5;">
                          <strong>Subject:</strong> ${subject}<br>
                          <strong>Message:</strong><br>
                          ${message.replace(/\n/g, '<br>')}
                        </p>
                      </div>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        In the meantime, feel free to browse our collection of question bank books for CBSE & MPBSE Classes 9-12.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_DOMAIN || 'https://docs-reader-store.vercel.app'}" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                          Visit Our Store
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                      <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                        <strong>Score 100 Books Team</strong><br>
                        Your Partner in Academic Excellence
                      </p>
                      <p style="color: #999999; margin: 0; font-size: 12px;">
                        This is an automated response. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}