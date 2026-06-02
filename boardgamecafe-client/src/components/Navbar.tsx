import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>♟ Board Game Cafe</Link>
      <div style={styles.links}>
        <Link to="/games" style={styles.link}>Games</Link>
        <Link to="/tables" style={styles.link}>Tables</Link>
        {user && <Link to="/reservations" style={styles.link}>{isAdmin ? 'All Reservations' : 'My Reservations'}</Link>}
        {user ? (
          <span style={styles.userArea}>
            <span style={styles.username}>{user.username}</span>
            <button onClick={handleLogout} style={styles.outlineBtn}>Logout</button>
          </span>
        ) : (
          <span style={styles.userArea}>
            <Link to="/login" style={styles.outlineBtn}>Login</Link>
            <Link to="/register" style={styles.solidBtn}>Register</Link>
          </span>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 2rem', background: '#2c1d12', color: '#d4b896', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' },
  brand: { fontWeight: 700, fontSize: '1.3rem', color: '#e8a87c', textDecoration: 'none', fontFamily: "'Playfair Display', serif", letterSpacing: '0.01em' },
  links: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  link: { color: '#d4b896', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 },
  userArea: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  username: { color: '#e8a87c', fontSize: '0.9rem', fontWeight: 700 },
  outlineBtn: { padding: '0.35rem 0.9rem', background: 'transparent', color: '#e8a87c', border: '1.5px solid #e8a87c', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 },
  solidBtn: { padding: '0.35rem 0.9rem', background: '#b85c38', color: '#fff', border: '1.5px solid #b85c38', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 },
};
