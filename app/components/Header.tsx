"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">
              <Link href="/" className="hover:text-gray-700 transition duration-300">
                Vati Bangla Express
              </Link>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Home</Link>
            <Link href="/book-seat" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Book Seat</Link>
            <Link href="/tickets" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Tickets</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Contact</Link>
            <Link href="/user" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Login</Link>
            <Link href="/counter" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">Counter Login</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
