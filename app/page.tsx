"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { text: "Very smooth booking experience! The website is user-friendly and fast.", author: "Anika Rahman" },
    { text: "Best bus booking platform in Bangladesh. Highly recommended!", author: "Nazmus Shakib" },
    { text: "Amazing service! Got my tickets instantly with SMS confirmation.", author: "Fatima Khan" },
    { text: "Professional and reliable. Never had any issues with booking.", author: "Mohammad Ali" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchBuses = () => {
    // Scroll to popular routes section
    document.getElementById('popular-routes')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <main className={styles.container}>
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h2 className={styles.heroTitle}>
          Book Your Bus Ticket Online
        </h2>
        <p className={styles.heroSubtitle}>
           Quick, Easy & Secure Online Ticket Booking 
        </p>
        <button 
          className={styles.heroButton}
          onClick={handleSearchBuses}
        >
          🔍 Search Buses
        </button>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.featureItem}>
          <h3>🚀 Real-Time Seat Availability</h3>
          <p>Know which seats are available instantly with live updates and seat selection map</p>
        </div>
        <div className={styles.featureItem}>
          <h3>💳 Easy Booking</h3>
          <p>Book your ticket in just a few steps with multiple payment options available</p>
        </div>
        <div className={styles.featureItem}>
          <h3>📱 SMS/Email Notifications</h3>
          <p>Get instant confirmation via SMS or Email with QR code for easy boarding</p>
        </div>
      </section>

      {/* Popular Routes */}
      <section id="popular-routes" className={styles.popularSection}>
        <h3 className={styles.sectionTitle}>🛣️ Popular Bus Routes</h3>
        <div className={styles.routesContainer}>
          <div className={styles.routeCard}>
           🛣️ Dhaka → Netrakona <br /> 
            <span style={{color: '#ff1e00ff', fontSize: '1.4rem', fontWeight: 'bold'}}>From ৳400</span>
            <br />
            <small style={{opacity: 0.8}}>⏱️ 4 hours journey</small>
          </div>
          <div className={styles.routeCard}>
            🛣️ Netrakona → Dhaka <br /> 
            <span style={{color: '#ff0000ff', fontSize: '1.4rem', fontWeight: 'bold'}}>From ৳400</span>
            <br />
            <small style={{opacity: 0.8}}>⏱️ 4 hours journey</small>
          </div>
          <div className={styles.routeCard}>
            🛣️ Dhaka → Chittagong <br /> 
            <span style={{color: '#ff1e00ff', fontSize: '1.4rem', fontWeight: 'bold'}}>From ৳850</span>
            <br />
            <small style={{opacity: 0.8}}>⏱️ 6 hours journey</small>
          </div>
          <div className={styles.routeCard}>
            🛣️ Dhaka → Sylhet <br /> 
            <span style={{color: '#ff0000ff', fontSize: '1.4rem', fontWeight: 'bold'}}>From ৳750</span>
            <br />
            <small style={{opacity: 0.8}}>⏱️ 5 hours journey</small>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <h3 className={styles.sectionTitle}>💬 What Our Customers Say</h3>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p>"{testimonials[currentTestimonial].text}"</p>
            <span className={styles.testimonialAuthor}>- {testimonials[currentTestimonial].author}</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>"{testimonials[(currentTestimonial + 1) % testimonials.length].text}"</p>
            <span className={styles.testimonialAuthor}>- {testimonials[(currentTestimonial + 1) % testimonials.length].author}</span>
          </div>
        </div>
      </section>

      {/* News */}
      <section className={styles.newsSection}>
        <h3 className={styles.sectionTitle}>📰 Latest News & Updates</h3>
        <div className={styles.newsContainer}>
          <Link href="/bus/1" className={styles.newsCard}>
            🆕 New Routes Added! <br /> 
            <strong>More comfortable rides with AC buses</strong>
            <br />
            <small style={{opacity: 0.8}}>📅 Updated 2 days ago</small>
          </Link>
          <div className={styles.newsCard}>
            🎉 Holiday Offers <br /> 
            <strong>Up to 25% discounts on Eid journeys</strong>
            <br />
            <small style={{opacity: 0.8}}>📅 Valid till month end</small>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </main>
  );
}
