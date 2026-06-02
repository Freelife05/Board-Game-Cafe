import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      login(data);
      toast.success('Account created!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.cardTop}>
          <span style={styles.cardIcon}>🎲</span>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join Board Game Cafe today</p>
        </div>
        <label style={styles.label}>Username</label>
        <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} required maxLength={50} placeholder="your_username" />
        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={100} placeholder="you@example.com" />
        <label style={styles.label}>Password (min 8 characters)</label>
        <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" />
        <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Creating…' : 'Create Account'}</button>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.footerLink}>Sign in</Link></p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6ec', padding: '1rem' },
  card: { background: '#fffdf8', padding: '2.5rem', borderRadius: '14px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(62,30,10,0.12)', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #e2cdb9' },
  cardTop: { textAlign: 'center', marginBottom: '0.5rem' },
  cardIcon: { fontSize: '2rem' },
  title: { margin: '0.25rem 0 0.15rem', color: '#2c1d12' },
  subtitle: { color: '#a08470', fontSize: '0.9rem', margin: 0 },
  label: { fontSize: '0.88rem', fontWeight: 700, color: '#7a5c44' },
  input: { padding: '0.65rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', fontSize: '1rem', background: '#fffdf8', color: '#2c1d12' },
  btn: { padding: '0.8rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '0.25rem', boxShadow: '0 3px 8px rgba(184,92,56,0.25)' },
  footer: { textAlign: 'center', margin: 0, fontSize: '0.9rem', color: '#7a5c44' },
  footerLink: { color: '#b85c38', fontWeight: 700, textDecoration: 'none' },
};
