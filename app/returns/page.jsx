export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Return Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Window</h2>
          <p className="mb-4">You have 7 days from the date of delivery to return an item. Items must be in original condition with all packaging materials.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Eligible Items</h2>
          <p className="mb-4">The following items are eligible for return:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Books in original condition (no writing, highlighting, or damage)</li>
            <li>Items with manufacturing defects</li>
            <li>Items that were damaged during shipping</li>
            <li>Wrong items delivered</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Digital products and eBooks</li>
            <li>Books with writing, highlighting, or other markings</li>
            <li>Items damaged by misuse</li>
            <li>Items returned after 7 days</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Process</h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>Contact our customer service at support@score100books.com</li>
            <li>Provide your order number and reason for return</li>
            <li>Receive return authorization and shipping instructions</li>
            <li>Pack items securely in original packaging</li>
            <li>Ship items to our return address</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <p className="mb-4">Once we receive and inspect your returned item:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Approved returns will be refunded within 5-7 business days</li>
            <li>Refunds will be processed to the original payment method</li>
            <li>Shipping costs are non-refundable (unless item was defective)</li>
            <li>Return shipping costs are customer's responsibility</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="mb-4">We currently do not offer direct exchanges. Please return the item for a refund and place a new order for the desired item.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
          <p className="mb-4">If you receive a damaged or defective item, please contact us immediately at support@score100books.com with photos of the damage. We will provide a prepaid return label and full refund or replacement.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>For any questions about returns, please contact us at support@score100books.com or call our customer service team.</p>
        </section>
      </div>
    </div>
  );
}