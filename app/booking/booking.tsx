"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto calculate fare when route or bus type changes
    if (name === 'fromLocation' || name === 'toLocation' || name === 'busType') {
      calculateFare();
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
        alert(`Booking successful! Your ticket number is: ${response.data.ticketNumber}`);
        
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
        
        // Redirect to booking history
        router.push('/tickets');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🚌 Book Your Bus Ticket</h1>
            <p className="text-gray-600">Welcome, {user.fullName}! Choose your journey details below.</p>
          </div>

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
                    errors.fromLocation ? 'border-red-500' : 'border-gray-300'
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
                    errors.toLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter destination city"
                />
                {errors.toLocation && <p className="text-red-500 text-sm mt-1">{errors.toLocation}</p>}
              </div>
            </div>

            {/* Popular Routes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popular Routes</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        fromLocation: route.from,
                        toLocation: route.to,
                        fare: route.fare
                      }));
                    }}
                    className="p-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    {route.from} → {route.to}
                    <div className="text-xs text-gray-500">৳{route.fare} • {route.duration}</div>
                  </button>
                ))}
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
                    errors.journeyDate ? 'border-red-500' : 'border-gray-300'
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
                    errors.departureTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select departure time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.departureTime && <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>}
              </div>
            </div>

            {/* Bus Type and Seat */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Type *
                </label>
                <select
                  name="busType"
                  value={formData.busType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    errors.seatNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., A1, B2"
                />
                {errors.seatNumber && <p className="text-red-500 text-sm mt-1">{errors.seatNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fare (৳)
                </label>
                <input
                  type="number"
                  name="fare"
                  value={formData.fare}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                {errors.fare && <p className="text-red-500 text-sm mt-1">{errors.fare}</p>}
              </div>
            </div>

            {/* Passenger Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Passenger Information</h3>
              
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
                      errors.passengerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter passenger name"
                  />
                  {errors.passengerName && <p className="text-red-500 text-sm mt-1">{errors.passengerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passenger Phone *
                  </label>
                  <input
                    type="tel"
                    name="passengerPhone"
                    value={formData.passengerPhone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.passengerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.passengerPhone && <p className="text-red-500 text-sm mt-1">{errors.passengerPhone}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passenger Email
                </label>
                <input
                  type="email"
                  name="passengerEmail"
                  value={formData.passengerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium transition duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Booking...
                  </span>
                ) : (
                  `🎫 Confirm Booking ${formData.fare > 0 ? `- ৳${formData.fare}` : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}