'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './BusDetails.module.css';

interface BusData {
  id: string;
  name: string;
  route: string;
  departure: string;
  arrival: string;
  price: number;
  seats: number;
  type: string;
  company: string;
}

// Static bus data (demo purpose)
const busDatabase: { [key: string]: BusData } = {
  '1': {
    id: '1',
    name: 'Express 101',
    company: 'Hanif Enterprise',
    route: 'Dhaka → Chittagong',
    departure: '8:00 AM',
    arrival: '2:00 PM',
    price: 850,
    seats: 32,
    type: 'AC'
  },
  '2': {
    id: '2',
    name: 'Paribahan 205',
    company: 'Green Line',
    route: 'Dhaka → Sylhet',
    departure: '10:00 AM',
    arrival: '4:00 PM',
    price: 750,
    seats: 28,
    type: 'AC'
  },
  '3': {
    id: '3',
    name: 'Service 301',
    company: 'Shyamoli Paribahan',
    route: 'Dhaka → Rajshahi',
    departure: '11:00 PM',
    arrival: '6:00 AM',
    price: 650,
    seats: 35,
    type: 'Non-AC'
  }
};

export default function BusDetailsPage() {
  const params = useParams();
  const busId = params.id as string;
  const [busData, setBusData] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const bus = busDatabase[busId];
      if (bus) {
        setBusData(bus);
      } else {
        // Default bus data if ID not found
        setBusData({
          id: busId,
          name: `Express ${busId}`,
          company: 'Demo Bus Service',
          route: 'Dhaka → Destination',
          departure: '9:00 AM',
          arrival: '3:00 PM',
          price: 500,
          seats: 30,
          type: 'AC'
        });
      }
      setLoading(false);
    }, 1000);
  }, [busId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading bus details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!busData) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          <h2>❌ Bus Not Found</h2>
          <p>The requested bus details could not be found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.busDetailsCard}>
          <h1>🚌 {busData.company}</h1>
          <h2>{busData.name}</h2>
          
          <div className={styles.busInfo}>
            <div className={styles.infoItem}>
              <strong>Bus ID:</strong> {busData.id}
            </div>
            <div className={styles.infoItem}>
              <strong>Route:</strong> {busData.route}
            </div>
            <div className={styles.infoItem}>
              <strong>Departure:</strong> {busData.departure}
            </div>
            <div className={styles.infoItem}>
              <strong>Arrival:</strong> {busData.arrival}
            </div>
            <div className={styles.infoItem}>
              <strong>Price:</strong> ৳{busData.price}
            </div>
            <div className={styles.infoItem}>
              <strong>Available Seats:</strong> {busData.seats}
            </div>
            <div className={styles.infoItem}>
              <strong>Type:</strong> {busData.type}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.bookBtn}>
              🎫 Book Now - ৳{busData.price}
            </button>
            <button className={styles.backBtn} onClick={() => window.history.back()}>
              ⬅️ Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
