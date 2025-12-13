"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Soft glow blobs */}
      <div className="absolute top-16 left-10 w-48 md:w-80 h-48 md:h-80 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-50"></div>
      <div className="absolute top-24 right-6 w-48 md:w-80 h-48 md:h-80 bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-1/2 w-40 md:w-72 h-40 md:h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-8 md:pb-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-white/90 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-purple-100 mb-4 md:mb-5">
            <span className="text-purple-600 text-xs md:text-sm font-semibold">Score 100 Series</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight flex flex-col gap-1 md:gap-2 items-center">
            <span className="flex flex-wrap justify-center items-center gap-1">
              Master your
              <span className="relative inline-block">
                <span className="bg-lime-200 px-2 rounded-sm">board exams</span>
              </span>
              with
            </span>
            <span className="inline-flex flex-wrap justify-center items-center gap-2 md:gap-3">
              Score 100
              <span className="flex items-center gap-0.5 md:gap-1">
                <span className="w-4 md:w-6 h-6 md:h-10 bg-indigo-900 rounded-l-full"></span>
                <span className="w-4 md:w-6 h-6 md:h-10 bg-white border border-indigo-900"></span>
                <span className="w-4 md:w-6 h-6 md:h-10 bg-indigo-200"></span>
                <span className="w-4 md:w-6 h-6 md:h-10 bg-indigo-500 rounded-r-full"></span>
              </span>
              Books
            </span>
          </h1>
          <p className="text-sm md:text-lg text-gray-600 mt-3 md:mt-4 max-w-2xl mx-auto px-4">
            Complete Question Bank for CBSE & MPBSE Classes 9-12 with Previous Year Papers, Revision Notes & Practice Tests
          </p>
          <div className="mt-4 md:mt-6">
            <Link href="/categories">
              <button className="group inline-flex items-center gap-2 bg-indigo-900 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold shadow-lg hover:translate-y-[-1px] transition-transform text-sm md:text-base">
                Browse Books by Class
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          {/* Hero Image - Mobile */}
          <div className="flex justify-center">
            <img
              src="/hero.png"
              alt="Hero Person"
              className="h-48 sm:h-64 object-contain"
            />
          </div>

          {/* Cards Stack - Mobile */}
          <div className="flex flex-col gap-4 px-2">
            {/* Features card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <p className="text-lg font-bold text-gray-900 leading-snug mb-4">
                Complete exam preparation with Score 100 books.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["men/32", "women/44", "men/67"].map((p, i) => (
                    <img
                      key={p}
                      src={`https://randomuser.me/api/portraits/${p}.jpg`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      alt="avatar"
                    />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center text-sm font-bold">
                  +
                </div>
                <span className="text-sm text-gray-500 ml-2">50k+ students</span>
              </div>
            </div>

            {/* Stats Grid - Mobile */}
            <div className="grid grid-cols-2 gap-3">
              {/* Subjects card */}
              <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-400 rounded-2xl p-4 shadow-xl text-white">
                <span className="text-sm font-bold block mb-2">Subjects</span>
                <div className="flex flex-wrap gap-1">
                  {["Maths", "Science", "English", "Hindi"].map((item) => (
                    <span key={item} className="text-xs px-2 py-1 rounded-full bg-white/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Yellow stat card */}
              <div className="bg-yellow-200 rounded-2xl p-4 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900">10+</h2>
                <p className="text-gray-800 text-xs mt-1 leading-snug font-medium">
                  Years of Previous Papers
                </p>
              </div>
            </div>

            {/* Students card - Mobile */}
            <div className="bg-[#050a3d] text-white rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-200">Students Helped</p>
                  <h3 className="text-2xl font-bold">50,000+</h3>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 60, 80, 50, 100, 70].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: i === 4 ? "linear-gradient(180deg, #c8b7ff 0%, #a88cfb 100%)" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bento Layout */}
        <div className="relative mt-4 hidden lg:block" style={{ minHeight: "600px" }}>
          
          {/* Hero person image - behind cards on right */}
          <div className="absolute right-0 top-0 w-[480px] h-[600px] z-10">
            <img
              src="/hero.png"
              alt="Hero Person"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Features card (top-left) */}
          <div className="absolute top-0 left-0 w-[340px] bg-white rounded-3xl p-7 shadow-lg z-30">
            <p className="text-2xl font-bold text-gray-900 leading-snug mb-6">
              Complete exam<br />preparation with<br />Score 100 books.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {["men/32", "women/44", "men/67", "men/45"].map((p, i) => (
                  <img
                    key={p}
                    src={`https://randomuser.me/api/portraits/${p}.jpg`}
                    className="w-11 h-11 rounded-full border-3 border-white object-cover"
                    style={{ borderWidth: "3px" }}
                    alt="avatar"
                  />
                ))}
              </div>
              <div className="w-11 h-11 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xl font-bold">
                +
              </div>
              <svg className="w-28 h-20 ml-auto" viewBox="0 0 375.01 375.01" fill="#8b5cf6">
                <g>
                  <path d="M330.254,210.966c-56.916,1.224-110.16,25.704-167.076,28.764c-16.524,0.612-33.048-1.224-45.9-8.568 c23.256-4.283,45.288-12.239,61.812-27.54c17.749-15.911,19.584-45.287,8.568-66.095c-10.404-19.584-36.72-20.196-55.08-15.3 C89.125,132.63,59.75,184.65,84.229,221.369c-26.928,1.836-53.856,0-80.172,1.225c-5.508,0.611-5.508,8.567,0.612,8.567 c26.928,1.836,59.364,4.284,91.188,2.448c1.836,1.225,3.672,3.061,5.508,4.284c64.872,45.288,159.732-11.628,229.5-13.464 C338.821,223.817,338.821,210.354,330.254,210.966z M89.737,196.277c-6.732-25.091,15.3-46.511,35.496-56.916 c20.196-10.404,48.96-10.404,55.692,15.912c7.956,30.6-18.36,48.959-43.452,56.916c-11.628,3.672-22.644,6.12-34.272,7.344 C96.47,213.413,92.186,206.069,89.737,196.277z"/>
                  <path d="M371.869,211.577c-8.567-5.508-16.523-11.016-24.479-16.523c-6.732-4.896-13.464-10.404-21.42-12.24 c-6.12-1.836-12.24,7.344-6.732,11.627c6.732,4.896,14.076,9.18,20.809,13.464c4.896,3.061,9.792,6.732,14.075,9.792 c-4.896,2.448-9.792,4.284-14.688,6.732c-3.672,1.836-7.956,3.672-11.628,5.508c-1.224,0.612-2.448,1.836-3.061,3.06 c-1.836,2.448-0.611,1.225,0,0.612c-2.447,1.836-2.447,7.956,1.837,7.344l0,0c1.224,0.612,2.447,0.612,4.283,0.612 c4.284-1.224,9.181-3.06,13.464-4.896c9.181-3.673,18.36-7.345,26.929-12.24C376.153,220.758,376.153,214.025,371.869,211.577z"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom row: Services, Revenue, Yellow card - all on same line */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 z-20">
            
            {/* Subjects card (left) */}
            <div className="w-[380px] bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-400 rounded-3xl p-6 shadow-xl text-white flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Available Subjects</span>
                <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium">All Subjects</span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["Mathematics", "Science", "Social Science", "English", "Hindi", "Physics", "Chemistry", "Biology"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/20 border border-white/30">
                    {item}
                    <span className="w-5 h-5 rounded-full border border-white/50 flex items-center justify-center text-xs">→</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Success card (center) - shifted right */}
            <div className="w-[340px] bg-[#050a3d] text-white rounded-[30px] p-6 shadow-2xl ml-8">
              <p className="text-sm text-indigo-200 mb-1">Students Helped</p>
              <h3 className="text-4xl font-bold">50,000+</h3>
              <div className="relative mt-6 h-40 grid grid-cols-10 gap-2 items-end">
                <div className="absolute inset-x-0 bottom-5 h-px bg-white/20" />
                {[55, 28, 38, 24, 100, 54, 68, 22, 82, 62].map((h, i) => (
                  <div key={i} className="relative flex flex-col items-center justify-end h-full z-10">
                    {i === 4 && (
                      <div className="absolute bottom-[calc(100%+10px)] px-3 py-1.5 rounded-xl bg-white text-[#0b0d46] text-[11px] font-semibold shadow-md whitespace-nowrap">
                        <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-lime-400 align-middle"></span>
                        100% Pass
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${h}%`,
                        background: i === 4
                          ? "linear-gradient(180deg, #c8b7ff 0%, #a88cfb 100%)"
                          : "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 4px, rgba(255,255,255,0.9) 4px 6px, transparent 6px 12px)",
                        backgroundColor: i === 4 ? undefined : "rgba(255,255,255,0.12)",
                        borderRadius: "8px 8px 4px 4px",
                        boxShadow: "0 10px 18px rgba(0,0,0,0.25)",
                        marginTop: "auto"
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yellow stat card (right) - shifted right to overlap image more */}
            <div className="w-[260px] bg-yellow-200 rounded-3xl p-7 shadow-xl z-30 ml-12">
              <h2 className="text-5xl font-bold text-gray-900">10+</h2>
              <p className="text-gray-800 text-base mt-3 leading-snug font-medium">
                Years of Previous<br />Question Papers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
