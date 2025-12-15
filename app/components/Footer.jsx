"use client";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed!');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setMessage('Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <footer className="w-full bg-[#0a0a1a] text-white pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            {/* Logo */}
            <div>
              <img className="h-10" src="/logo.png" alt="Score 100 Books" />
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subscribe Newsletter</h3>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center bg-[#1a1a2e] rounded-full p-1.5 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address.."
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="group flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                {message && (
                  <p className={`text-sm ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-3">
              {[
                { name: "Class 9 Books", href: "/categories/class-09" },
                { name: "Class 10 Books", href: "/categories/class-10" },
                { name: "Class 11 Books", href: "/categories/class-11" },
                { name: "Class 12 Books", href: "/categories/class-12" },
                { name: "All Products", href: "/search" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <ul className="space-y-3">
              {[
                { name: "Mathematics", href: "/collections/mathematics" },
                { name: "Biology", href: "/collections/biology" },
                { name: "Chemistry", href: "/collections/chemistry" },
                { name: "Physics", href: "/collections/physics" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Help & Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "/contact-us" },
                { name: "FAQs", href: "/contact-us#faq" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Return Policy", href: "/returns" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Score 100 Books. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:milestone.cbse@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
                <Mail size={14} />
                milestone.cbse@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
