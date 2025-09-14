'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface BusData {
  id: string;
  name: string;
  route: string;
  departure: string;
  arrival: string;
  price: number;
  seats: number;
  type: string;
  company: string;
}

// Static bus data (demo purpose)
const busDatabase: { [key: string]: BusData } = {
  '1': {
    id: '1',
    name: 'Express 101',
    company: 'Hanif Enterprise',
    route: 'Dhaka → Chittagong',
    departure: '8:00 AM',
    arrival: '2:00 PM',
    price: 850,
    seats: 32,
    type: 'AC'
  },
  '2': {
    id: '2',
    name: 'Paribahan 205',
    company: 'Green Line',
    route: 'Dhaka → Sylhet',
    departure: '10:00 AM',
    arrival: '4:00 PM',
    price: 750,
    seats: 28,
    type: 'AC'
  },
  '3': {
    id: '3',
    name: 'Service 301',
    company: 'Shyamoli Paribahan',
    route: 'Dhaka → Rajshahi',
    departure: '11:00 PM',
    arrival: '6:00 AM',
    price: 650,
    seats: 35,
    type: 'Non-AC'
  }
};

export default function BusDetailsPage() {
  const params = useParams();
  const busId = params.id as string;
  const [busData, setBusData] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const bus = busDatabase[busId];
      if (bus) {
        setBusData(bus);
      } else {
        // Default bus data if ID not found
        setBusData({
          id: busId,
          name: `Express ${busId}`,
          company: 'Demo Bus Service',
          route: 'Dhaka → Destination',
          departure: '9:00 AM',
          arrival: '3:00 PM',
          price: 500,
          seats: 30,
          type: 'AC'
        });
      }
      setLoading(false);
    }, 1000);
  }, [busId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bus details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!busData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-2">❌ Bus Not Found</h2>
            <p className="text-red-500">The requested bus details could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center text-gray-800">
              🚌 {busData.company}
            </h1>
            <h2 className="text-xl mt-2 opacity-90">{busData.name}</h2>
          </div>
          
          {/* Bus Info Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 w-24">Bus ID:</span>
                  <span className="text-gray-900">{busData.id}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 w-24">Route:</span>
                  <span className="text-gray-900">{busData.route}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 w-24">Departure:</span>
                  <span className="text-gray-900">{busData.departure}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 w-24">Arrival:</span>
                  <span className="text-gray-900">{busData.arrival}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-semibold text-green-700 w-24">Price:</span>
                  <span className="text-2xl font-bold text-green-600">৳{busData.price}</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-semibold text-blue-700 w-24">Seats:</span>
                  <span className="text-blue-600 font-semibold">{busData.seats} Available</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-semibold text-purple-700 w-24">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    busData.type === 'AC' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {busData.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
                🎫 Book Now - ৳{busData.price}
              </button>
              <button 
                onClick={() => window.history.back()}
                className="sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300"
              >
                ⬅️ Go Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
