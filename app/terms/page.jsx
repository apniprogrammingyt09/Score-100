export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using Score 100 Books website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="mb-4">Permission is granted to temporarily download one copy of the materials on Score 100 Books website for personal, non-commercial transitory viewing only.</p>
          <p className="mb-4">Under this license you may not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
          <p className="mb-4">We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>All prices are subject to change without notice</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Payment must be received before order processing</li>
            <li>We accept various payment methods as displayed at checkout</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
          <p className="mb-4">You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-4">In no event shall Score 100 Books or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at milestone.cbse@gmail.com</p>
        </section>
      </div>
    </div>
  );
}