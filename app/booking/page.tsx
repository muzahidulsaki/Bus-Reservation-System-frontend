"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { pusher, subscribeToBookingNotifications, subscribeToUserNotifications } from '../../lib/pusher';

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:8080";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

interface BookingFormData {
  fromLocation: string;
  toLocation: string;
  journeyDate: string;
  departureTime: string;
  busType: string;
  seatNumber: string;
  fare: number;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    fromLocation: '',
    toLocation: '',
    journeyDate: '',
    departureTime: '',
    busType: 'AC',
    seatNumber: '',
    fare: 0,
    passengerName: '',
    passengerPhone: '',
    passengerEmail: ''
  });

  const [errors, setErrors] = useState<any>({});

  // Popular routes with fare information
  const popularRoutes = [
    { from: 'Dhaka', to: 'Chittagong', fare: 850, duration: '6h 30m' },
    { from: 'Dhaka', to: 'Sylhet', fare: 650, duration: '5h 45m' },
    { from: 'Dhaka', to: 'Rajshahi', fare: 550, duration: '4h 30m' },
    { from: 'Dhaka', to: 'Rangpur', fare: 750, duration: '6h 15m' },
    { from: 'Dhaka', to: 'Khulna', fare: 600, duration: '5h 30m' },
    { from: 'Dhaka', to: 'Barisal', fare: 500, duration: '4h 45m' },
    { from: 'Dhaka', to: 'Netrakona', fare: 400, duration: '4h 00m' },
    { from: 'Netrakona', to: 'Dhaka', fare: 400, duration: '4h 00m' },
  ];

  const busTypes = [
    { value: 'AC', label: 'AC Bus', priceMultiplier: 1.5 },
    { value: 'Non-AC', label: 'Non-AC Bus', priceMultiplier: 1 },
    { value: 'Sleeper', label: 'Sleeper Coach', priceMultiplier: 2 },
    { value: 'Deluxe', label: 'Deluxe', priceMultiplier: 1.3 },
  ];

  const timeSlots = [
    '06:00', '07:30', '09:00', '10:30', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  useEffect(() => {
    checkUserSession();
  }, []);

  // Setup Pusher event listeners
  useEffect(() => {
    if (user) {
      setupPusherListeners();
    }
    
    return () => {
      // Cleanup Pusher subscriptions
      pusher.disconnect();
    };
  }, [user]);

  const setupPusherListeners = () => {
    if (!user) return;

    // Listen to booking events
    const bookingChannel = pusher.subscribe('bookings');
    bookingChannel.bind('booking-created', function(data: any) {
      console.log('New booking:', data);
      showNotificationMessage('New booking created!');
    });

    // Listen to user notifications
    const userChannel = pusher.subscribe(`user-${user.id}`);
    userChannel.bind('notification', function(data: any) {
      console.log('User notification:', data);
      showNotificationMessage(data.message);
    });
  };

  const showNotificationMessage = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setShowNotification(true);
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 300);
    }, 5000);
  };

  const checkUserSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/check-session`);
      
      if (response.data.isLoggedIn) {
        const userData = response.data.user;
        setUser(userData);
        
        // Pre-fill passenger information
        setFormData(prev => ({
          ...prev,
          passengerName: userData.fullName,
          passengerPhone: userData.phone || '',
          passengerEmail: userData.email
        }));
      } else {
        router.push('/user');
      }
    } catch (error) {
      console.error("Session check failed:", error);
      router.push('/user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }

    // Auto calculate fare when route or bus type changes
    if (name === 'fromLocation' || name === 'toLocation' || name === 'busType') {
      setTimeout(calculateFare, 100); // Small delay to ensure state is updated
    }
  };

  const calculateFare = () => {
    const route = popularRoutes.find(r => 
      r.from.toLowerCase() === formData.fromLocation.toLowerCase() && 
      r.to.toLowerCase() === formData.toLocation.toLowerCase()
    );
    
    if (route) {
      const busType = busTypes.find(bt => bt.value === formData.busType);
      const calculatedFare = Math.round(route.fare * (busType?.priceMultiplier || 1));
      setFormData(prev => ({ ...prev, fare: calculatedFare }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.fromLocation.trim()) newErrors.fromLocation = 'From location is required';
    if (!formData.toLocation.trim()) newErrors.toLocation = 'To location is required';
    if (!formData.journeyDate) newErrors.journeyDate = 'Journey date is required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
    if (!formData.seatNumber.trim()) newErrors.seatNumber = 'Seat number is required';
    if (!formData.passengerName.trim()) newErrors.passengerName = 'Passenger name is required';
    if (!formData.passengerPhone.trim()) newErrors.passengerPhone = 'Passenger phone is required';
    if (formData.fare <= 0) newErrors.fare = 'Please select a valid route';

    // Validate journey date (should be today or future)
    const today = new Date().toISOString().split('T')[0];
    if (formData.journeyDate < today) {
      newErrors.journeyDate = 'Journey date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/booking/create`, formData);
      
      if (response.data.success) {
        // Show success notification via Pusher (this will be triggered by backend)
        showNotificationMessage(`✅ Booking successful! Your ticket number is: ${response.data.ticketNumber}`);
        
        // Also show traditional alert for immediate feedback
        alert(`✅ Booking successful! Your ticket number is: ${response.data.ticketNumber}`);
        
        // Reset form
        setFormData({
          fromLocation: '',
          toLocation: '',
          journeyDate: '',
          departureTime: '',
          busType: 'AC',
          seatNumber: '',
          fare: 0,
          passengerName: user?.fullName || '',
          passengerPhone: user?.phone || '',
          passengerEmail: user?.email || ''
        });
        
        // Redirect to tickets page after a short delay
        setTimeout(() => {
          router.push('/tickets');
        }, 2000);
      } else {
        alert(response.data.message || 'Booking failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectPopularRoute = (route: any) => {
    setFormData(prev => ({
      ...prev,
      fromLocation: route.from,
      toLocation: route.to,
      fare: Math.round(route.fare * (busTypes.find(bt => bt.value === formData.busType)?.priceMultiplier || 1))
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Notification Component */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
                showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">🔔</span>
                  <span>{notification}</span>
                </div>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🚌 Book Your Bus Ticket</h1>
            <p className="text-gray-600">Welcome, {user.fullName}! Choose your journey details below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Routes Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🛣️ Popular Routes</h3>
                <div className="space-y-3">
                  {popularRoutes.map((route, index) => (
                    <div 
                      key={index}
                      onClick={() => selectPopularRoute(route)}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{route.from} → {route.to}</p>
                          <p className="text-sm text-gray-600">⏱️ {route.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">৳{route.fare}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Route Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Location *
                      </label>
                      <input
                        type="text"
                        name="fromLocation"
                        value={formData.fromLocation}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.fromLocation ? 'border-red-500' : 'border-gray-300 text-gray-800'
                        }`}
                        placeholder="Enter departure city"
                      />
                      {errors.fromLocation && <p className="text-red-500 text-sm mt-1">{errors.fromLocation}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Location *
                      </label>
                      <input
                        type="text"
                        name="toLocation"
                        value={formData.toLocation}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.toLocation ? 'border-red-500' : 'border-gray-300 text-gray-800'
                        }`}
                        placeholder="Enter destination city"
                      />
                      {errors.toLocation && <p className="text-red-500 text-sm mt-1">{errors.toLocation}</p>}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Journey Date *
                      </label>
                      <input
                        type="date"
                        name="journeyDate"
                        value={formData.journeyDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.journeyDate ? 'border-red-500' : 'border-gray-300 text-gray-800'
                        }`}
                      />
                      {errors.journeyDate && <p className="text-red-500 text-sm mt-1">{errors.journeyDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departure Time *
                      </label>
                      <select
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.departureTime ? 'border-red-500' : 'border-gray-300 text-gray-800'
                        }`}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.departureTime && <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>}
                    </div>
                  </div>

                  {/* Bus Type and Seat */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Type *
                      </label>
                      <select
                        name="busType"
                        value={formData.busType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      >
                        {busTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seat Number *
                      </label>
                      <input
                        type="text"
                        name="seatNumber"
                        value={formData.seatNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.seatNumber ? 'border-red-500' : 'border-gray-300 text-gray-800'
                        }`}
                        placeholder="e.g., A1, B2, C3"
                      />
                      {errors.seatNumber && <p className="text-red-500 text-sm mt-1">{errors.seatNumber}</p>}
                    </div>
                  </div>

                  {/* Fare Display */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total Fare:</span>
                      <span className="text-2xl font-bold text-green-600">৳{formData.fare}</span>
                    </div>
                    {formData.fare > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Route: {formData.fromLocation} → {formData.toLocation} ({formData.busType})
                      </p>
                    )}
                  </div>

                  {/* Passenger Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Passenger Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passenger Name *
                        </label>
                        <input
                          type="text"
                          name="passengerName"
                          value={formData.passengerName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.passengerName ? 'border-red-500' : 'border-gray-300 text-gray-800'
                          }`}
                        />
                        {errors.passengerName && <p className="text-red-500 text-sm mt-1">{errors.passengerName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="passengerPhone"
                          value={formData.passengerPhone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.passengerPhone ? 'border-red-500' : 'border-gray-300 text-gray-800'
                          }`}
                        />
                        {errors.passengerPhone && <p className="text-red-500 text-sm mt-1">{errors.passengerPhone}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="passengerEmail"
                        value={formData.passengerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        '🎫 Book Ticket'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => router.push('/tickets')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      📋 View My Tickets
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}