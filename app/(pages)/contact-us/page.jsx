"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden py-16">
      {/* Soft glow blobs */}
      <div className="absolute top-16 left-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-50"></div>
      <div className="absolute top-24 right-6 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm border border-purple-100 mb-5">
            <MessageCircle size={16} className="text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight">
            Contact <span className="bg-lime-200 px-2 rounded-sm">Us</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions about our books or need assistance? We&apos;re here to help you succeed in your exams!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info Cards */}
          <div className="flex flex-col gap-6">
            {/* Info Card 1 - Address */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">Our Office</h3>
                  <p className="text-gray-600 leading-relaxed">
                    123 Education Street<br />
                    Knowledge Park, New Delhi<br />
                    India - 110001
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card 2 - Phone */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-lg">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">Call Us</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 12345 67890</p>
                </div>
              </div>
            </div>

            {/* Info Card 3 - Email */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">support@score100books.com</p>
                  <p className="text-gray-600">info@score100books.com</p>
                </div>
              </div>
            </div>

            {/* Info Card 4 - Working Hours */}
            <div className="bg-[#050a3d] text-white rounded-3xl p-7 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Working Hours</h3>
                  <p className="text-indigo-200">Monday - Saturday</p>
                  <p className="text-white font-semibold text-lg">9:00 AM - 6:00 PM</p>
                  <p className="text-indigo-200 mt-2 text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-lime-200 flex items-center justify-center mb-6">
                  <Send size={32} className="text-indigo-900" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-3">Message Sent!</h3>
                <p className="text-gray-600 max-w-sm">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-purple-600 font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Order Inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-2 bg-indigo-900 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:translate-y-[-1px] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Quick answers to common questions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How can I track my order?",
                a: "Once your order is shipped, you'll receive a tracking link via email and SMS to monitor your delivery status."
              },
              {
                q: "What is the return policy?",
                a: "We offer a 7-day return policy for unused books in their original condition. Contact us for return requests."
              },
              {
                q: "Do you offer bulk discounts?",
                a: "Yes! Schools and coaching centers can avail special bulk pricing. Contact us for a custom quote."
              },
              {
                q: "Are the books available in regional languages?",
                a: "Currently, our books are available in English and Hindi. More languages coming soon!"
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                <h4 className="text-lg font-bold text-indigo-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
