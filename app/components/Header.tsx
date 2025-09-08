"use client";

import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          <h1>
            <Link href="/">Vati Bangla Express</Link>
          </h1>
        </div>
        <nav className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/book-seat" className={styles.navLink}>Book Seat</Link>
            <Link href="/tickets" className={styles.navLink}>Tickets</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            <Link href="/user" className={styles.navLink}>Login</Link>
            <Link href="/counter" className={styles.navLink}>Counter Login</Link>
        </nav>
      </div>
    </header>
  );
}
