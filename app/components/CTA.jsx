"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-0 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-200 rounded-3xl overflow-hidden min-h-[320px] md:min-h-[400px] mb-[-80px] md:mb-[-100px]">
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Ready to score<br />
              100 in your<br />
              board exams?
            </h2>
            <Link href="/contact-us">
              <button className="group inline-flex items-center gap-2 bg-indigo-900/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium border border-indigo-900/20 hover:bg-indigo-900 hover:text-white transition-all duration-300 w-fit">
                Contact Us
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="absolute right-0 bottom-0 w-[280px] sm:w-[320px] md:w-[400px] lg:w-[450px] h-full">
            <img
              src="/hero.png"
              alt="Student"
              className="w-full h-full object-contain object-bottom"
            />
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-purple-400/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
