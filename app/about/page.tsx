'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface AboutData {
  id: number;
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string[];
  team: {
    name: string;
    position: string;
    description: string;
  }[];
}

export default function AboutUs() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      // Real API call would be like this:
      // const response = await axios.get('http://localhost:5000/api/about');
      // setAboutData(response.data);
      
      // For now, using mock data
      const mockData: AboutData = {
        id: 1,
        title: "About Vati Bangla Express",
        content: "Vati Bangla Express has been serving Bangladesh with reliable bus transportation services since 2020. We are committed to providing safe, comfortable, and affordable travel experiences for all our passengers.",
        mission: "To provide safe, reliable, and comfortable transportation services that connect people across Bangladesh while maintaining the highest standards of customer service.",
        vision: "To become the leading bus service provider in Bangladesh, known for excellence in service, safety, and customer satisfaction.",
        values: [
          "Safety First - Your safety is our top priority",
          "Customer Service - We put customers at the heart of everything we do", 
          "Reliability - On-time service you can count on",
          "Comfort - Modern buses with comfortable seating",
          "Affordability - Quality service at reasonable prices"
        ],
        team: [
          {
            name: "Muzahidul Islam Saki",
            position: "Founder & CEO",
            description: "With 15 years of experience in transportation industry"
          },
          {
            name: "Mashood Ahmed", 
            position: "Operations Manager",
            description: "Expert in logistics and route management"
          },
          {
            name: "Mohammad Ali",
            position: "Safety Director", 
            description: "Ensures all safety protocols are followed"
          }
        ]
      };
      
      // Simulate API delay
      setTimeout(() => {
        setAboutData(mockData);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load about information');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading about information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchAboutData} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">🚌 {aboutData?.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{aboutData?.content}</p>
          </section>

          {/* Mission, Vision, Values */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">{aboutData?.mission}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔮 Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">{aboutData?.vision}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">💎 Our Values</h2>
              <ul className="text-gray-600 space-y-2">
                {aboutData?.values.map((value, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✅</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Team Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">👥 Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutData?.team.map((member, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <h4 className="text-primary-600 font-semibold mb-3">{member.position}</h4>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-primary-600 text-white py-16 rounded-xl mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">📊 Our Achievement</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-primary-700 p-6 rounded-lg">
                <h3 className="text-3xl font-bold mb-2">50,000+</h3>
                <p className="text-primary-100">Happy Passengers</p>
              </div>
              <div className="bg-primary-700 p-6 rounded-lg">
                <h3 className="text-3xl font-bold mb-2">25+</h3>
                <p className="text-primary-100">Routes Covered</p>
              </div>
              <div className="bg-primary-700 p-6 rounded-lg">
                <h3 className="text-3xl font-bold mb-2">50+</h3>
                <p className="text-primary-100">Modern Buses</p>
              </div>
              <div className="bg-primary-700 p-6 rounded-lg">
                <h3 className="text-3xl font-bold mb-2">99.5%</h3>
                <p className="text-primary-100">On-time Performance</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}