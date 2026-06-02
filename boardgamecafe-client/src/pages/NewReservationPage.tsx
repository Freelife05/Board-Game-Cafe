import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { CafeTable, BoardGame } from '../types';

export default function NewReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [games, setGames] = useState<BoardGame[]>([]);
  const [form, setForm] = useState({
    tableId: searchParams.get('tableId') || '',
    boardGameId: '',
    reservationDate: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00',
    partySize: 2,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/tables', { params: { status: 'Available', pageSize: 100 } }),
      api.get('/boardgames', { params: { pageSize: 100 } }),
    ]).then(([tr, gr]) => {
      setTables(tr.data.items);
      setGames(gr.data.items.filter((g: BoardGame) => g.isAvailable));
    }).catch(() => toast.error('Failed to load tables and games'));
  }, []);

  useEffect(() => {
    if (form.tableId && form.startTime && form.endTime) {
      const table = tables.find(t => t.id === +form.tableId);
      if (table) {
        const [sh, sm] = form.startTime.split(':').map(Number);
        const [eh, em] = form.endTime.split(':').map(Number);
        const hours = (eh * 60 + em - sh * 60 - sm) / 60;
        setEstimatedCost(hours > 0 ? hours * table.hourlyRate : null);
      }
    }
  }, [form.tableId, form.startTime, form.endTime, tables]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        tableId: +form.tableId,
        boardGameId: form.boardGameId ? +form.boardGameId : null,
        reservationDate: form.reservationDate + 'T00:00:00.000Z',
        startTime: form.startTime,
        endTime: form.endTime,
        partySize: form.partySize,
        notes: form.notes || null,
      };
      await api.post('/reservations', payload);
      toast.success('Reservation confirmed!');
      navigate('/reservations');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>New Reservation</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Table *</label>
        <select value={form.tableId} onChange={e => setForm(f => ({ ...f, tableId: e.target.value }))} required style={styles.input}>
          <option value="">Select a table…</option>
          {tables.map(t => (
            <option key={t.id} value={t.id}>
              Table #{t.tableNumber} — {t.locationZone} (cap {t.capacity}, €{t.hourlyRate}/hr){t.isVIP ? ' ★ VIP' : ''}
            </option>
          ))}
        </select>

        <label style={styles.label}>Board Game (optional)</label>
        <select value={form.boardGameId} onChange={e => setForm(f => ({ ...f, boardGameId: e.target.value }))} style={styles.input}>
          <option value="">No game</option>
          {games.map(g => (
            <option key={g.id} value={g.id}>{g.title} ({g.genre}, {g.minPlayers}–{g.maxPlayers} players)</option>
          ))}
        </select>

        <label style={styles.label}>Date *</label>
        <input type="date" value={form.reservationDate} onChange={e => setForm(f => ({ ...f, reservationDate: e.target.value }))} required min={new Date().toISOString().split('T')[0]} style={styles.input} />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Start Time *</label>
            <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>End Time *</label>
            <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required style={styles.input} />
          </div>
        </div>

        <label style={styles.label}>Party Size *</label>
        <input type="number" value={form.partySize} onChange={e => setForm(f => ({ ...f, partySize: +e.target.value }))} min={1} max={20} required style={styles.input} />

        <label style={styles.label}>Notes (optional)</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} maxLength={500} style={{ ...styles.input, height: '80px' }} placeholder="Any special requests?" />

        {estimatedCost !== null && (
          <div style={styles.costBox}>
            Estimated cost: <strong>€{estimatedCost.toFixed(2)}</strong>
          </div>
        )}

        <div style={styles.row}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>{loading ? 'Booking…' : 'Confirm Reservation'}</button>
          <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: '560px', margin: '2rem auto', padding: '0 1.5rem' },
  title: { color: '#2c1d12', marginBottom: '1.5rem' },
  form: { background: '#fffdf8', padding: '2rem', borderRadius: '14px', boxShadow: '0 4px 16px rgba(62,30,10,0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem', border: '1px solid #e2cdb9' },
  label: { fontSize: '0.88rem', fontWeight: 700, color: '#7a5c44' },
  input: { padding: '0.65rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const },
  row: { display: 'flex', gap: '0.85rem' },
  costBox: { background: '#f5ece0', padding: '0.85rem 1rem', borderRadius: '8px', color: '#7a5c44', fontSize: '0.95rem', border: '1px solid #e2cdb9', fontWeight: 600 },
  submitBtn: { flex: 2, padding: '0.8rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: '0 3px 8px rgba(184,92,56,0.25)' },
  cancelBtn: { flex: 1, padding: '0.8rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
};
