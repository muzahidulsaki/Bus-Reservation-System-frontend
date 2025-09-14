"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:8080";

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface Booking {
  id: number;
  fromLocation: string;
  toLocation: string;
  journeyDate: string;
  departureTime: string;
  busType: string;
  seatNumber: string;
  fare: number;
  passengerName: string;
  passengerPhone: string;
  status: string;
  ticketNumber: string;
  createdAt: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/check-session`);
      
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
        await fetchUserBookings();
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

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booking/my-bookings`);
      
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await axios.patch(`${API_BASE_URL}/booking/cancel/${bookingId}`);
      
      if (response.data.success) {
        alert('Booking cancelled successfully');
        await fetchUserBookings(); // Refresh bookings
      } else {
        alert(response.data.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎫 My Tickets</h1>
          <p className="text-gray-600">Welcome back, {user.fullName}! Here are your booking details.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">You haven't made any bus bookings yet. Start your journey today!</p>
            <button
              onClick={() => router.push('/book-seat')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Book Your First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <span className="text-2xl">🚌</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {booking.fromLocation} → {booking.toLocation}
                        </h3>
                        <p className="text-sm text-gray-600">Ticket #{booking.ticketNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Journey Date</p>
                        <p className="font-medium">{formatDate(booking.journeyDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Departure Time</p>
                        <p className="font-medium">{booking.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bus Type</p>
                        <p className="font-medium">{booking.busType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Seat Number</p>
                        <p className="font-medium">{booking.seatNumber}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-600">Passenger Name</p>
                        <p className="font-medium">{booking.passengerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone Number</p>
                        <p className="font-medium">{booking.passengerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Fare</p>
                        <p className="font-medium text-lg text-green-600">৳{booking.fare}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => window.print()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                        >
                          🖨️ Print Ticket
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
                        >
                          ❌ Cancel Booking
                        </button>
                      </>
                    )}
                    {booking.status === 'cancelled' && (
                      <span className="text-red-600 text-sm font-medium">Booking Cancelled</span>
                    )}
                  </div>
                </div>

                <div className="border-t mt-4 pt-4 text-xs text-gray-500">
                  Booked on: {formatDate(booking.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/book-seat')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mr-4"
          >
            🎫 Book New Ticket
          </button>
          <button
            onClick={() => router.push('/user')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            👤 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}