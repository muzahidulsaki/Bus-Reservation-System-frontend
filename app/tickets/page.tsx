"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:8080";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

interface Ticket {
  id: number;
  ticketNumber: string;
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
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export default function TicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/check-session`);
      
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
        await fetchTickets();
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

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booking/user-tickets`);
      
      if (response.data.success) {
        setTickets(response.data.tickets || []);
      } else {
        console.error("Failed to fetch tickets:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // For development, show some sample data
      setSampleTickets();
    }
  };

  // Sample data for development
  const setSampleTickets = () => {
    const sampleTickets: Ticket[] = [
      {
        id: 1,
        ticketNumber: "BT001234",
        fromLocation: "Dhaka",
        toLocation: "Chittagong",
        journeyDate: "2024-01-25",
        departureTime: "09:00",
        busType: "AC",
        seatNumber: "A12",
        fare: 850,
        passengerName: "John Doe",
        passengerPhone: "01712345678",
        passengerEmail: "john@example.com",
        bookingDate: "2024-01-20",
        status: "confirmed"
      },
      {
        id: 2,
        ticketNumber: "BT001235",
        fromLocation: "Dhaka",
        toLocation: "Sylhet",
        journeyDate: "2024-01-15",
        departureTime: "14:00",
        busType: "Non-AC",
        seatNumber: "B8",
        fare: 650,
        passengerName: "John Doe",
        passengerPhone: "01712345678",
        passengerEmail: "john@example.com",
        bookingDate: "2024-01-10",
        status: "completed"
      }
    ];
    setTickets(sampleTickets);
  };

  const getFilteredTickets = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tickets.filter(ticket => {
      const journeyDate = new Date(ticket.journeyDate);
      journeyDate.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'upcoming':
          return journeyDate >= today && ticket.status === 'confirmed';
        case 'completed':
          return ticket.status === 'completed' || (journeyDate < today && ticket.status === 'confirmed');
        case 'cancelled':
          return ticket.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const getStatusBadge = (ticket: Ticket) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = new Date(ticket.journeyDate);
    journeyDate.setHours(0, 0, 0, 0);

    if (ticket.status === 'cancelled') {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Cancelled</span>;
    } else if (ticket.status === 'completed' || journeyDate < today) {
      return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Completed</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Confirmed</span>;
    }
  };

  const cancelTicket = async (ticketId: number) => {
    if (!confirm("Are you sure you want to cancel this ticket?")) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/booking/cancel/${ticketId}`);
      
      if (response.data.success) {
        alert("✅ Ticket cancelled successfully!");
        await fetchTickets(); // Refresh tickets
      } else {
        alert(response.data.message || "Failed to cancel ticket");
      }
    } catch (error: any) {
      console.error("Cancel ticket error:", error);
      alert(error.response?.data?.message || "Failed to cancel ticket");
    }
  };

  const downloadTicket = (ticket: Ticket) => {
    // Create a simple text format for the ticket
    const ticketContent = `
═══════════════════════════════════════
🚌 BUS TICKET
═══════════════════════════════════════
Ticket Number: ${ticket.ticketNumber}
Passenger: ${ticket.passengerName}
Phone: ${ticket.passengerPhone}

Journey Details:
From: ${ticket.fromLocation}
To: ${ticket.toLocation}
Date: ${ticket.journeyDate}
Time: ${ticket.departureTime}
Bus Type: ${ticket.busType}
Seat: ${ticket.seatNumber}

Fare: ৳${ticket.fare}
Booking Date: ${ticket.bookingDate}
Status: ${ticket.status.toUpperCase()}

═══════════════════════════════════════
Please arrive 30 minutes before departure
Have a safe journey!
═══════════════════════════════════════
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your tickets...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredTickets = getFilteredTickets();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎫 My Tickets</h1>
            <p className="text-gray-600">Manage and view all your bus bookings</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              onClick={() => router.push('/booking')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              🚌 Book New Ticket
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
            >
              🏠 Back to Home
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {[
              { key: 'all', label: 'All Tickets', icon: '📋' },
              { key: 'upcoming', label: 'Upcoming', icon: '⏰' },
              { key: 'completed', label: 'Completed', icon: '✅' },
              { key: 'cancelled', label: 'Cancelled', icon: '❌' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  filter === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {item.icon} {item.label} ({tickets.filter(t => {
                  if (item.key === 'all') return true;
                  if (item.key === 'upcoming') {
                    const journeyDate = new Date(t.journeyDate);
                    return journeyDate >= new Date() && t.status === 'confirmed';
                  }
                  if (item.key === 'completed') {
                    const journeyDate = new Date(t.journeyDate);
                    return t.status === 'completed' || (journeyDate < new Date() && t.status === 'confirmed');
                  }
                  return t.status === item.key;
                }).length})
              </button>
            ))}
          </div>

          {/* Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No tickets found' : `No ${filter} tickets`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't booked any tickets yet. Start your journey today!"
                  : `You don't have any ${filter} tickets at the moment.`
                }
              </p>
              <button
                onClick={() => router.push('/booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                🚌 Book Your First Ticket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                  {/* Ticket Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{ticket.ticketNumber}</h3>
                        <p className="text-blue-100 text-sm">{ticket.passengerName}</p>
                      </div>
                      {getStatusBadge(ticket)}
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="p-6">
                    {/* Route Information */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-800">{ticket.fromLocation}</span>
                        <div className="flex-1 mx-3 border-t-2 border-dashed border-gray-300 relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-full w-3 h-3"></div>
                        </div>
                        <span className="text-lg font-semibold text-gray-800">{ticket.toLocation}</span>
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        🚌 {ticket.busType} Bus
                      </div>
                    </div>

                    {/* Journey Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">📅 Date</p>
                        <p className="font-semibold">{new Date(ticket.journeyDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">⏰ Time</p>
                        <p className="font-semibold">{ticket.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">💺 Seat</p>
                        <p className="font-semibold">{ticket.seatNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">💰 Fare</p>
                        <p className="font-semibold text-green-600">৳{ticket.fare}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-4 mb-4">
                      <p className="text-xs text-gray-600 mb-1">📞 {ticket.passengerPhone}</p>
                      {ticket.passengerEmail && (
                        <p className="text-xs text-gray-600">📧 {ticket.passengerEmail}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadTicket(ticket)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 transition duration-200"
                      >
                        📥 Download
                      </button>
                      
                      {ticket.status === 'confirmed' && new Date(ticket.journeyDate) > new Date() && (
                        <button
                          onClick={() => cancelTicket(ticket.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition duration-200"
                        >
                          ❌ Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Booking Date Footer */}
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-600 border-t">
                    Booked on: {new Date(ticket.bookingDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}