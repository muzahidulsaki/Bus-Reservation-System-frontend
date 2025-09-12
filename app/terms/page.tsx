'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">📑 Terms & Conditions</h1>
            <p className="text-sm text-gray-500 mb-6">Last Updated: December 2024</p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to Vati Bangla Express. These terms and conditions outline the rules and regulations 
              for the use of our bus reservation services.
            </p>
          </section>

          <section className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎫 Booking & Reservations</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>All bookings are subject to availability</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Payment must be completed to confirm reservation</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Booking confirmation will be sent via email/SMS</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Passengers must arrive 30 minutes before departure</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Payment & Refunds</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Full refund for cancellations 24 hours before departure</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>50% refund for cancellations 12-24 hours before</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>No refund for cancellations within 12 hours</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Service charges may apply for refunds</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🚌 Travel Conditions</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Valid ID required for travel</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Luggage restrictions apply</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>No smoking or alcohol allowed</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Follow driver and staff instructions</li>
              </ul>
            </div>

            <div className="bg-primary-50 p-8 rounded-xl border border-primary-200">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">📞 Contact Information</h2>
              <p className="text-primary-700 mb-2">For any queries regarding these terms:</p>
              <p className="text-primary-600">📧 Email: vatibanglaexp@gmail.com</p>
              <p className="text-primary-600">📱 Phone: +880123456789</p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
