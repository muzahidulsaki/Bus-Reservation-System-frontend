"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";

// ✅ Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

const API_BASE_URL = "http://localhost:8080";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const testimonials = [
    { text: "Very smooth booking experience! The website is user-friendly and fast.", author: "Anika Rahman" },
    { text: "Best bus booking platform in Bangladesh. Highly recommended!", author: "Nazmus Shakib" },
    { text: "Amazing service! Got my tickets instantly with SMS confirmation.", author: "Fatima Khan" },
    { text: "Professional and reliable. Never had any issues with booking.", author: "Mohammad Ali" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    // Check user session on page load
    checkUserSession();
    
    return () => clearInterval(interval);
  }, []);

  const checkUserSession = async () => {
    try {
      console.log("🔍 Checking user session...");
      
      const response = await axios.get(`${API_BASE_URL}/user/check-session`);
      
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
        console.log("✅ User logged in:", response.data.user.fullName);
      } else {
        console.log("❌ No active session");
      }
    } catch (error) {
      console.log("⚠️ Session check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchBuses = () => {
    if (user) {
      // If user is logged in, redirect to booking page
      window.location.href = '/booking';
    } else {
      // If not logged in, scroll to popular routes section
      document.getElementById('popular-routes')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Component - Handles login/logout state automatically */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-black py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 text-black ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {user ? `Welcome back, ${user.fullName}!` : 'Book Your Bus Ticket Online'}
          </h2>
          <p className={`text-xl md:text-2xl mb-8 transition-all duration-1000 delay-200 text-black ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {user ? 'Ready for your next journey?' : 'Quick, Easy & Secure Online Ticket Booking'}
          </p>
          <button 
            className={`bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isVisible ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-8'}`}
            onClick={handleSearchBuses}
          >
            {user ? '🎫 Book New Ticket' : '🔍 Search Buses'}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Real-Time Seat Availability</h3>
              <p className="text-gray-600">Know which seats are available instantly with live updates and seat selection map</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💳 Easy Booking</h3>
              <p className="text-gray-600">Book your ticket in just a few steps with multiple payment options available</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📱 SMS/Email Notifications</h3>
              <p className="text-gray-600">Get instant confirmation via SMS or Email with QR code for easy boarding</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard Section (Only for logged in users) */}
      {user && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">📊 Your Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Link href="/booking" className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition duration-300 text-center">
                <div className="text-3xl mb-4">�</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">Book Ticket</div>
                <div className="text-gray-600">Book your next journey</div>
              </Link>
              
              <Link href="/tickets" className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition duration-300 text-center">
                <div className="text-3xl mb-4">🎫</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">My Tickets</div>
                <div className="text-gray-600">View and manage your tickets</div>
              </Link>
              
              <Link href="/user" className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition duration-300 text-center">
                <div className="text-3xl mb-4">👤</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">My Profile</div>
                <div className="text-gray-600">Update your information</div>
              </Link>
              
              <Link href="/tickets" className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition duration-300 text-center">
                <div className="text-3xl mb-4">📈</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">Travel History</div>
                <div className="text-gray-600">See your past journeys</div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Routes */}
      <section id="popular-routes" className={`py-16 px-4 ${user ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">🛣️ Popular Bus Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition duration-300">
              <div className="text-lg font-semibold text-gray-800 mb-2">🛣️ Dhaka → Netrakona</div>
              <div className="text-2xl font-bold text-red-600 mb-2">From ৳400</div>
              <div className="text-sm text-gray-600">⏱️ 4 hours journey</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition duration-300">
              <div className="text-lg font-semibold text-gray-800 mb-2">🛣️ Netrakona → Dhaka</div>
              <div className="text-2xl font-bold text-red-600 mb-2">From ৳400</div>
              <div className="text-sm text-gray-600">⏱️ 4 hours journey</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition duration-300">
              <div className="text-lg font-semibold text-gray-800 mb-2">🛣️ Dhaka → Chittagong</div>
              <div className="text-2xl font-bold text-red-600 mb-2">From ৳850</div>
              <div className="text-sm text-gray-600">⏱️ 6 hours journey</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition duration-300">
              <div className="text-lg font-semibold text-gray-800 mb-2">🛣️ Dhaka → Sylhet</div>
              <div className="text-2xl font-bold text-red-600 mb-2">From ৳750</div>
              <div className="text-sm text-gray-600">⏱️ 5 hours journey</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">💬 What Our Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 text-lg mb-4 italic">"{testimonials[currentTestimonial].text}"</p>
              <div className="text-primary-600 font-semibold text-black">- {testimonials[currentTestimonial].author}</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 text-lg mb-4 italic">"{testimonials[(currentTestimonial + 1) % testimonials.length].text}"</p>
              <div className="text-primary-600 font-semibold text-black">- {testimonials[(currentTestimonial + 1) % testimonials.length].author}</div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">📰 Latest News & Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/bus/1" className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-500">
              <div className="text-xl font-bold text-gray-800 mb-2">🆕 New Routes Added!</div>
              <div className="text-lg text-gray-700 mb-2">More comfortable rides with AC buses</div>
              <div className="text-sm text-gray-500">📅 Updated 2 days ago</div>
            </Link>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-orange-500">
              <div className="text-xl font-bold text-gray-800 mb-2">🎉 Holiday Offers</div>
              <div className="text-lg text-gray-700 mb-2">Up to 25% discounts on Eid journeys</div>
              <div className="text-sm text-gray-500">📅 Valid till month end</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </main>
  );
}