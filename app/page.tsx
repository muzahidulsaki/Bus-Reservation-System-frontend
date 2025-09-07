import Link from "next/link";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>Vati Bangla Express</h1>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/book-seat" className={styles.navLink}>Book Seat</Link>
            <Link href="/tickets" className={styles.navLink}>Tickets</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            <Link href="/user" className={styles.navLink}>Login</Link>
            <Link href="/counter" className={styles.navLink}>Counter Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h2 className={styles.heroTitle}>
          Book Your Bus Ticket Online
        </h2>
        <p className={styles.heroSubtitle}>
          Quick, Easy & Secure Online Ticket Booking
        </p>
        <button className={styles.heroButton}>
          Search Buses
        </button>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.featureItem}>
          <h3>Real-Time Seat Availability</h3>
          <p>Know which seats are available instantly</p>
        </div>
        <div className={styles.featureItem}>
          <h3>Easy Booking</h3>
          <p>Book your ticket in just a few steps</p>
        </div>
        <div className={styles.featureItem}>
          <h3>SMS/Email Notifications</h3>
          <p>Get instant confirmation via SMS or Email</p>
        </div>
      </section>

      {/* Popular Routes */}
      <section className={styles.popularSection}>
        <h3 className={styles.sectionTitle}>Popular Routes</h3>
        <div className={styles.routesContainer}>
          <div className={styles.routeCard}>
            Dhaka → Netrakona <br /> From 400৳
          </div>
          <div className={styles.routeCard}>
            Netrakona → Dhaka <br /> From 400৳
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <h3 className={styles.sectionTitle}>What Our Customers Say</h3>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p>"Very smooth booking experience!"</p>
            <span className={styles.testimonialAuthor}>- Anika</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>"Best bus booking platform in Bangladesh."</p>
            <span className={styles.testimonialAuthor}>- Nazmus Shakib</span>
          </div>
        </div>
      </section>

      {/* News */}
      <section className={styles.newsSection}>
        <h3 className={styles.sectionTitle}>Latest News</h3>
        <div className={styles.newsContainer}>
          <div className={styles.newsCard}>
            New Routes Added! <br /> More comfortable rides
          </div>
          <div className={styles.newsCard}>
            Holiday Offers <br /> Discounts on Eid journeys
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4>Vati Bangla Express</h4>
            <p>Fast, Safe & Reliable</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms and Condition</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: vatibanglaexp@gmail.com</p>
            <p>Phone: +880123456789</p>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          © 2025 VatiBanglaExpress. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
