"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

interface Admin {
  id: number;
  fullName: string;
  email: string;
  status: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSessions();
  }, []);

  const checkSessions = async () => {
    try {
      // Check user session
      const userResponse = await axios.get(`${API_BASE_URL}/user/check-session`);
      if (userResponse.data.isLoggedIn) {
        setUser(userResponse.data.user);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.log("No active user session");
    }

    try {
      // Check admin session if no user session
      const adminResponse = await axios.get(`${API_BASE_URL}/admin/check-session`);
      if (adminResponse.data.isLoggedIn) {
        setAdmin(adminResponse.data.admin);
      }
    } catch (error) {
      console.log("No active admin session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (user) {
        await axios.post(`${API_BASE_URL}/user/logout`);
        setUser(null);
      } else if (admin) {
        await axios.post(`${API_BASE_URL}/admin/logout`);
        setAdmin(null);
      }
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
      );
    }

    if (user) {
      // User logged in state - Show user name with link to /user
      return (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">
            👋 Hello, <Link href="/user" className="text-blue-600 hover:underline">{user.fullName}</Link>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            🚪 Logout
          </button>
        </div>
      );
    }

    if (admin) {
      // Admin logged in state - Show admin name with link to /admin
      return (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">
            👋 Hello, <Link href="/admin" className="text-blue-600 hover:underline">{admin.fullName}</Link>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            🚪 Logout
          </button>
        </div>
      );
    }

    // Logged out state - Show login buttons
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/user" 
          className="text-gray-700 hover:text-primary-600 font-medium transition duration-300"
        >
          👤 User Login
        </Link>
        <Link 
          href="/admin" 
          className="text-gray-700 hover:text-primary-600 font-medium transition duration-300"
        >
          🔧 Counter Login
        </Link>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              Vati Bangla Express
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
              Home
            </Link>
            {user && (
              <>
                <Link href="/booking" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                  Book Ticket
                </Link>
                <Link href="/tickets" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                  My Tickets
                </Link>
              </>
            )}
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
              Contact
            </Link>
            <Link href="/bus/1" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
              Bus Information
            </Link>
          </nav>

          {/* Auth Section - Dynamic based on login status */}
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}