'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './terms.module.css';

export default function TermsConditions() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.header}>
            <h1 className={styles.title}>📑 Terms & Conditions</h1>
            <p className={styles.lastUpdated}>Last Updated: December 2024</p>
            <p className={styles.intro}>
              Welcome to Vati Bangla Express. These terms and conditions outline the rules and regulations 
              for the use of our bus reservation services.
            </p>
          </section>

          <section className={styles.content}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🎫 Booking & Reservations</h2>
              <ul className={styles.pointsList}>
                <li>All bookings are subject to availability</li>
                <li>Payment must be completed to confirm reservation</li>
                <li>Booking confirmation will be sent via email/SMS</li>
                <li>Passengers must arrive 30 minutes before departure</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>💰 Payment & Refunds</h2>
              <ul className={styles.pointsList}>
                <li>Full refund for cancellations 24 hours before departure</li>
                <li>50% refund for cancellations 12-24 hours before</li>
                <li>No refund for cancellations within 12 hours</li>
                <li>Service charges may apply for refunds</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🚌 Travel Conditions</h2>
              <ul className={styles.pointsList}>
                <li>Valid ID required for travel</li>
                <li>Luggage restrictions apply</li>
                <li>No smoking or alcohol allowed</li>
                <li>Follow driver and staff instructions</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
