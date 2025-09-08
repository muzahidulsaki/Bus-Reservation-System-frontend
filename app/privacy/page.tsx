'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './privacy.module.css';

interface PrivacyData {
  id: number;
  title: string;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
    points?: string[];
  }[];
}

export default function PrivacyPolicy() {
  const [privacyData, setPrivacyData] = useState<PrivacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      // Real API call would be like this:
      // const response = await axios.get('http://localhost:5000/api/privacy-policy');
      // setPrivacyData(response.data);
      
      // For now, using mock data
      const mockData: PrivacyData = {
        id: 1,
        title: "Privacy Policy",
        lastUpdated: "December 2024",
        sections: [
          {
            title: "📋 Information We Collect",
            content: "We collect information you provide directly to us when you:",
            points: [
              "Create an account with Vati Bangla Express",
              "Book tickets or reserve seats",
              "Contact our customer support",
              "Subscribe to our newsletter",
              "Use our mobile application or website"
            ]
          },
          {
            title: "🔒 How We Use Your Information",
            content: "We use the information we collect to:",
            points: [
              "Process your ticket bookings and payments",
              "Provide customer support and respond to inquiries",
              "Send you booking confirmations and travel updates",
              "Improve our services and user experience",
              "Comply with legal obligations and prevent fraud"
            ]
          },
          {
            title: "🛡️ Information Security",
            content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:",
            points: [
              "SSL encryption for data transmission",
              "Secure servers and databases",
              "Regular security audits and updates",
              "Limited access to personal information",
              "Employee training on data protection"
            ]
          },
          {
            title: "🔄 Information Sharing",
            content: "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:",
            points: [
              "With your consent",
              "To comply with legal requirements",
              "To protect our rights and prevent fraud",
              "With service providers who assist in our operations",
              "In case of business merger or acquisition"
            ]
          },
          {
            title: "🍪 Cookies and Tracking",
            content: "We use cookies and similar technologies to:",
            points: [
              "Remember your preferences and settings",
              "Analyze website traffic and usage patterns",
              "Provide personalized content and advertisements",
              "Improve website functionality and performance",
              "Ensure security and prevent fraud"
            ]
          },
          {
            title: "✅ Your Rights",
            content: "You have the right to:",
            points: [
              "Access your personal information",
              "Correct inaccurate or incomplete data",
              "Request deletion of your personal information",
              "Opt-out of marketing communications",
              "File a complaint with data protection authorities"
            ]
          },
          {
            title: "👶 Children's Privacy",
            content: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information."
          },
          {
            title: "📧 Contact Us",
            content: "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:",
            points: [
              "Email: privacy@vatibanglaexpress.com",
              "Phone: +880123456789",
              "Address: Dhaka, Bangladesh",
              "Customer Support: Available 24/7"
            ]
          }
        ]
      };
      
      // Simulate API delay
      setTimeout(() => {
        setPrivacyData(mockData);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load privacy policy');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading privacy policy...</p>
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
          <button onClick={fetchPrivacyData} className={styles.retryBtn}>
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
          {/* Header Section */}
          <section className={styles.header}>
            <h1 className={styles.title}>🔐 {privacyData?.title}</h1>
            <p className={styles.lastUpdated}>
              Last Updated: {privacyData?.lastUpdated}
            </p>
            <p className={styles.intro}>
              At Vati Bangla Express, we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </p>
          </section>

          {/* Content Sections */}
          <section className={styles.content}>
            {privacyData?.sections.map((section, index) => (
              <div key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionContent}>{section.content}</p>
                
                {section.points && (
                  <ul className={styles.pointsList}>
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex} className={styles.point}>
                        ✅ {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          {/* Notice Section */}
          <section className={styles.notice}>
            <div className={styles.noticeCard}>
              <h3>⚠️ Important Notice</h3>
              <p>
                This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
                by posting the new Privacy Policy on our website. Your continued use of our services after such 
                modifications will constitute your acknowledgment and acceptance of the modified Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
