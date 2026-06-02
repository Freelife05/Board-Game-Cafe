import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={styles.wrapper}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Board Game Cafe</h1>
        <p style={styles.sub}>Browse our game library, find the perfect table, and book your session.</p>
        <div style={styles.actions}>
          <Link to="/games" style={styles.primaryBtn}>Browse Games</Link>
          <Link to="/tables" style={styles.secondaryBtn}>View Tables</Link>
          {user && <Link to="/reservations" style={styles.secondaryBtn}>My Reservations</Link>}
        </div>
      </div>
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.icon}>🎲</div>
          <h3 style={styles.cardTitle}>50+ Board Games</h3>
          <p style={styles.cardText}>From quick party games to deep strategy titles.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>☕</div>
          <h3 style={styles.cardTitle}>Cozy Tables</h3>
          <p style={styles.cardText}>Standard and VIP tables for every group size.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>📅</div>
          <h3 style={styles.cardTitle}>Easy Reservations</h3>
          <p style={styles.cardText}>Book a table with your game of choice in seconds.</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  hero: {
    textAlign: 'center', padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #fffdf8 0%, #f5ece0 100%)',
    borderRadius: '16px', marginBottom: '2.5rem',
    border: '1px solid #e2cdb9', boxShadow: '0 4px 16px rgba(62,30,10,0.08)',
  },
  title: { fontSize: '2.75rem', color: '#2c1d12', marginBottom: '1rem' },
  sub: { fontSize: '1.1rem', color: '#7a5c44', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { padding: '0.85rem 1.75rem', background: '#b85c38', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 3px 8px rgba(184,92,56,0.3)' },
  secondaryBtn: { padding: '0.85rem 1.75rem', background: '#fffdf8', color: '#4a7c59', border: '2px solid #4a7c59', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { background: '#fffdf8', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(62,30,10,0.08)', textAlign: 'center', border: '1px solid #e2cdb9' },
  icon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  cardTitle: { color: '#2c1d12', marginBottom: '0.5rem' },
  cardText: { color: '#7a5c44', fontSize: '0.95rem', lineHeight: 1.7 },
};
