"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our books, adding items to your cart, and proceeding to checkout. Create an account or checkout as a guest."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD) for eligible orders."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard delivery takes 5-7 business days, while express delivery takes 2-3 business days. Processing time is 1-2 business days."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes! We offer free standard shipping on all orders above ₹500. Orders below ₹500 have a shipping charge of ₹50."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 24 hours of placing it, provided it hasn't been shipped. Contact our customer service for assistance."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery. Items must be in original condition. Digital products cannot be returned."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard."
    },
    {
      question: "Are the books original?",
      answer: "Yes, all our books are 100% original and sourced directly from publishers. We guarantee authenticity."
    },
    {
      question: "Do you have eBooks available?",
      answer: "Yes, we offer digital versions of many books. eBooks are delivered instantly via email after payment confirmation."
    },
    {
      question: "What if I receive a damaged book?",
      answer: "If you receive a damaged book, contact us immediately with photos. We'll provide a replacement or full refund with prepaid return shipping."
    },
    {
      question: "Can I change my delivery address?",
      answer: "You can change your delivery address before the order is shipped. Contact customer service as soon as possible."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special pricing for bulk orders. Contact us at support@score100books.com for bulk purchase inquiries."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <p className="text-gray-600 text-center mb-12">Find answers to common questions about our books and services</p>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              {openItems[index] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openItems[index] && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Our customer support team is here to help.</p>
        <a 
          href="/contact-us" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}