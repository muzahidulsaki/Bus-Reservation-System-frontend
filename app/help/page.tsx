'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './help.module.css';

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a bus ticket?",
      answer: "You can book tickets by selecting your route, choosing your preferred seat, and completing the payment process. Our booking system is available 24/7."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Full refund for cancellations 24 hours before departure, 50% refund for 12-24 hours before, and no refund within 12 hours of departure."
    },
    {
      question: "Can I change my travel date?",
      answer: "Yes, you can change your travel date up to 12 hours before departure, subject to seat availability and a small service charge."
    },
    {
      question: "What documents do I need for travel?",
      answer: "You need a valid government-issued ID (National ID, Passport, or Driving License) and your booking confirmation."
    },
    {
      question: "How early should I arrive at the station?",
      answer: "We recommend arriving at least 30 minutes before departure time to complete check-in and boarding procedures."
    },
    {
      question: "What are the luggage restrictions?",
      answer: "Each passenger can carry up to 20kg of luggage. Additional charges apply for excess baggage. Prohibited items include flammable materials and weapons."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.header}>
            <h1 className={styles.title}>❓ Help & Support</h1>
            <p className={styles.intro}>
              Find answers to frequently asked questions or contact our support team for assistance.
            </p>
          </section>

          {/* Search Section */}
          <section className={styles.searchSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="🔍 Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </section>

          {/* Quick Help Cards */}
          <section className={styles.quickHelp}>
            <h2>🚀 Quick Help</h2>
            <div className={styles.helpGrid}>
              <div className={styles.helpCard}>
                <h3>🎫 Booking Help</h3>
                <p>Learn how to book tickets, select seats, and make payments</p>
              </div>
              <div className={styles.helpCard}>
                <h3>💰 Refund Process</h3>
                <p>Understand our refund policy and how to request refunds</p>
              </div>
              <div className={styles.helpCard}>
                <h3>🚌 Travel Guidelines</h3>
                <p>Important information about travel documents and luggage</p>
              </div>
              <div className={styles.helpCard}>
                <h3>📞 Contact Support</h3>
                <p>Get in touch with our 24/7 customer support team</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2>❓ Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {filteredFaqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className={`${styles.faqIcon} ${expandedFaq === index ? styles.expanded : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contactSection}>
            <h2>💬 Still Need Help?</h2>
            <div className={styles.contactOptions}>
              <div className={styles.contactOption}>
                <h3>📧 Email Support</h3>
                <p>vatibanglaexp@gmail.com</p>
                <p>Response within 24 hours</p>
              </div>
              <div className={styles.contactOption}>
                <h3>📱 Phone Support</h3>
                <p>+880123456789</p>
                <p>Available 24/7</p>
              </div>
              <div className={styles.contactOption}>
                <h3>💬 Live Chat</h3>
                <p>Chat with our support team</p>
                <p>Instant response</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
