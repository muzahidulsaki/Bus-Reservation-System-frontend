"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  pusher, 
  subscribeToGeneralNotifications,
  subscribeToUserNotifications,
  subscribeToAdminNotifications,
  subscribeToSystemNotifications 
} from '../../lib/pusher';

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

interface NotificationData {
  message: string;
  type?: string;
  timestamp?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Notification states
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    checkSessions();
  }, []);

  // Setup Pusher listeners when user/admin logs in
  useEffect(() => {
    if (user || admin) {
      setupPusherListeners();
    }
    
    return () => {
      // Cleanup Pusher subscriptions on logout
      pusher.disconnect();
    };
  }, [user, admin]);

  const setupPusherListeners = () => {
    if (user) {
      // User-specific notifications
      subscribeToUserNotifications(user.id, (data: NotificationData) => {
        addNotification(`👤 ${data.message}`);
      });
      
      // General notifications for users
      subscribeToGeneralNotifications((data: NotificationData) => {
        addNotification(`📢 ${data.message}`);
      });
    }
    
    if (admin) {
      // Admin notifications
      subscribeToAdminNotifications((data: NotificationData) => {
        addNotification(`🔔 Admin: ${data.message}`);
      });
      
      // System notifications for admins
      subscribeToSystemNotifications((data: NotificationData) => {
        addNotification(`⚠️ System: ${data.message}`);
      });
      
      // General notifications for admins
      subscribeToGeneralNotifications((data: NotificationData) => {
        addNotification(`📢 ${data.message}`);
      });
    }
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 notifications
    setNotificationCount(prev => prev + 1);
    
    // Auto clear notification after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
      setNotificationCount(prev => Math.max(0, prev - 1));
    }, 10000);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
    setShowNotification(false);
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotification && !target.closest('.notification-container')) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotification]);

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

          {/* Notifications */}
          {(user || admin) && (
            <div className="relative mr-4 notification-container">
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-300"
              >
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotification && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                        >
                          <div className="flex items-start">
                            <span className="mr-2 mt-1">🔔</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{notification}</p>
                              <p className="text-xs text-gray-500 mt-1">Just now</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth Section - Dynamic based on login status */}
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}