import Link from "next/link";
import styles from "./Footer.module.css"; // আপনার CSS ফাইল

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* কোম্পানি ইনফো */}
        <div className={styles.footerSection}>
          <h4>🚌 Vati Bangla Express</h4>
          <p>Fast, Safe & Reliable transportation service connecting major cities across Bangladesh.</p>
        </div>

        {/* কুইক লিঙ্কস */}
        <div className={styles.footerSection}>
          <h4>🔗 Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/about">📜 About Us</Link>
            </li>
            <li>
              <Link href="/privacy">📜 Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">📑 Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/contact">📞 Contact Us</Link>
            </li>
            <li>
              <Link href="/help">❓ Help & Support</Link>
            </li>
          </ul>
        </div>

        {/* যোগাযোগ */}
        <div className={styles.footerSection}>
          <h4>📞 Contact Information</h4>
          <p>Email: vatibanglaexp@gmail.com</p>
          <p>Phone: +880123456789</p>
          <p>Address: Dhaka, Bangladesh</p>
          <p>✅ 24/7 Customer Support</p>
        </div>
      </div>

      {/* কপিরাইট */}
      <div className={styles.footerCopyright}>
        <p>
          © 2025 VatiBanglaExpress. All Rights Reserved. <br />
          ❤️ Made with passion for better travel experience
        </p>
      </div>
    </footer>
  );
}
