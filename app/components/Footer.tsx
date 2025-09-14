import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary-400">🚌 Vati Bangla Express</h4>
            <p className="text-gray-300 leading-relaxed">Fast, Safe & Reliable transportation service connecting major cities across Bangladesh.</p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-primary-400">🔗 Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition duration-300">📜 About Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-primary-400 transition duration-300">📜 Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary-400 transition duration-300">📑 Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400 transition duration-300">📞 Contact Us</Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-primary-400 transition duration-300">❓ Help & Support</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-primary-400">📞 Contact Information</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: vatibanglaexp@gmail.com</p>
              <p>Phone: +880123456789</p>
              <p>Address: Dhaka, Bangladesh</p>
              <p className="text-green-400 font-semibold">✅ 24/7 Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 VatiBanglaExpress. All Rights Reserved. <br />
            <span className="text-red-400">❤️</span> Made with passion for better travel experience
          </p>
        </div>
      </div>
    </footer>
  );
}
