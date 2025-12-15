export default function ShippingInfo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Standard Delivery</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Delivery Time: 5-7 business days</li>
              <li>Cost: ₹50 (Free for orders above ₹500)</li>
              <li>Available across India</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Express Delivery</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Delivery Time: 2-3 business days</li>
              <li>Cost: ₹100</li>
              <li>Available in major cities</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders are processed within 1-2 business days</li>
            <li>Orders placed on weekends will be processed on Monday</li>
            <li>During peak seasons, processing may take 2-3 business days</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Locations</h2>
          <p className="mb-4">We currently ship to all locations within India. International shipping is not available at this time.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>You will receive a tracking number via email once your order ships</li>
            <li>Track your order status in your account dashboard</li>
            <li>SMS updates will be sent for delivery milestones</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Guidelines</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Someone must be available to receive the package</li>
            <li>Valid ID may be required for delivery</li>
            <li>If delivery fails, we will attempt redelivery the next business day</li>
            <li>After 3 failed attempts, the package will be returned to us</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Charges</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Free Shipping</h3>
            <p>Enjoy free standard shipping on all orders above ₹500!</p>
          </div>
          <ul className="list-disc pl-6 mb-4">
            <li>Standard Delivery: ₹50 (Free above ₹500)</li>
            <li>Express Delivery: ₹100</li>
            <li>Cash on Delivery: Additional ₹25 charge</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Digital Products</h2>
          <p className="mb-4">eBooks and digital products are delivered instantly via email after payment confirmation. No shipping charges apply.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>For shipping-related queries, contact us at milestone.cbse@gmail.com or call our customer service team.</p>
        </section>
      </div>
    </div>
  );
}