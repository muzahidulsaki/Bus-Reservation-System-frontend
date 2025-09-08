'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './contact.module.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will respond within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.header}>
            <h1 className={styles.title}>📞 Contact Us</h1>
            <p className={styles.intro}>
              Get in touch with us for any queries, support, or feedback. We're here to help you 24/7!
            </p>
          </section>

          <div className={styles.contactContent}>
            {/* Contact Information */}
            <section className={styles.contactInfo}>
              <h2>🏢 Get In Touch</h2>
              <div className={styles.infoCard}>
                <h3>📧 Email</h3>
                <p>vatibanglaexp@gmail.com</p>
              </div>
              <div className={styles.infoCard}>
                <h3>📱 Phone</h3>
                <p>+880123456789</p>
              </div>
              <div className={styles.infoCard}>
                <h3>📍 Address</h3>
                <p>Dhaka, Bangladesh</p>
              </div>
              <div className={styles.infoCard}>
                <h3>🕒 Support Hours</h3>
                <p>24/7 Customer Support</p>
              </div>
            </section>

            {/* Contact Form */}
            <section className={styles.contactForm}>
              <h2>💬 Send us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="refund">Refund Request</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here..."
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  📤 Send Message
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
