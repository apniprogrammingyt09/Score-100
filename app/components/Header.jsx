"use client";

import { Heart, Search, ShoppingCart, UserCircle2, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuList = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "CBSE Books",
      link: "/boards/CBSE",
    },
    {
      name: "MPBSE Books",
      link: "/boards/MPBoard",
    },
    {
      name: "Contact",
      link: "/contact-us",
    },
  ];
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                className="h-9 w-auto"
                src="/logo.png"
                alt="Score 100 Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuList.map((item) => (
                <Link key={item.name} href={item.link}>
                  <button className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1">
              <AuthContextProvider>
                <AdminButton />
              </AuthContextProvider>
              
              <Link href="/search">
                <button
                  title="Search Books"
                  aria-label="Search Books"
                  className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-50 transition-colors"
                >
                  <Search size={16} />
                </button>
              </Link>
              
              <AuthContextProvider>
                <HeaderClientButtons />
              </AuthContextProvider>
              
              <Link href="/account">
                <button
                  title="My Account"
                  aria-label="My Account"
                  className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-50 transition-colors"
                >
                  <UserCircle2 size={16} />
                </button>
              </Link>
              
              <AuthContextProvider>
                <LogoutButton />
              </AuthContextProvider>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {menuList.map((item) => (
                <Link key={item.name} href={item.link}>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
