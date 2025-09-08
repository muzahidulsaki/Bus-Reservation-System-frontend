'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './about.module.css';

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
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading about information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchAboutData} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>🚌 {aboutData?.title}</h1>
            <p className={styles.subtitle}>{aboutData?.content}</p>
          </section>

          {/* Mission, Vision, Values */}
          <section className={styles.valuesSection}>
            <div className={styles.valueCard}>
              <h2>🎯 Our Mission</h2>
              <p>{aboutData?.mission}</p>
            </div>
            
            <div className={styles.valueCard}>
              <h2>🔮 Our Vision</h2>
              <p>{aboutData?.vision}</p>
            </div>
            
            <div className={styles.valueCard}>
              <h2>💎 Our Values</h2>
              <ul>
                {aboutData?.values.map((value, index) => (
                  <li key={index}>✅ {value}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Team Section */}
          <section className={styles.teamSection}>
            <h2>👥 Our Team</h2>
            <div className={styles.teamGrid}>
              {aboutData?.team.map((member, index) => (
                <div key={index} className={styles.teamCard}>
                  <div className={styles.avatar}>👤</div>
                  <h3>{member.name}</h3>
                  <h4>{member.position}</h4>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className={styles.statsSection}>
            <h2>📊 Our Achievement</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>50,000+</h3>
                <p>Happy Passengers</p>
              </div>
              <div className={styles.statCard}>
                <h3>25+</h3>
                <p>Routes Covered</p>
              </div>
              <div className={styles.statCard}>
                <h3>50+</h3>
                <p>Modern Buses</p>
              </div>
              <div className={styles.statCard}>
                <h3>99.5%</h3>
                <p>On-time Performance</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
