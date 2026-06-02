import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { Reservation, PagedResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

interface EditReservationForm {
  tableId: number;
  boardGameId: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  partySize: number;
  status: string;
  notes: string;
}

export default function ReservationsPage() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<PagedResult<Reservation> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [descending, setDescending] = useState(true);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<EditReservationForm>({
    tableId: 0, boardGameId: '', reservationDate: '', startTime: '',
    endTime: '', partySize: 1, status: 'Pending', notes: '',
  });
  const [games, setGames] = useState<{ id: number; title: string }[]>([]);
  const [tables, setTables] = useState<{ id: number; tableNumber: number }[]>([]);

  const fetchReservations = async () => {
    try {
      const endpoint = isAdmin ? '/reservations' : '/reservations/my';
      const params = isAdmin ? { status, date: date || undefined, page, pageSize: 8, sortBy, descending } : { page, pageSize: 8, descending };
      const { data: res } = await api.get(endpoint, { params });
      setData(res);
    } catch { toast.error('Failed to load reservations'); }
  };

  const fetchDropdowns = async () => {
    try {
      const [gr, tr] = await Promise.all([
        api.get('/boardgames', { params: { pageSize: 100 } }),
        api.get('/tables', { params: { pageSize: 100 } }),
      ]);
      setGames(gr.data.items);
      setTables(tr.data.items);
    } catch { }
  };

  useEffect(() => { fetchReservations(); }, [page, sortBy, descending, isAdmin]);
  useEffect(() => { fetchDropdowns(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchReservations(); };

  const openEdit = (r: Reservation) => {
    setEditing(r);
    setForm({
      tableId: r.tableId,
      boardGameId: r.boardGameId ? String(r.boardGameId) : '',
      reservationDate: r.reservationDate.split('T')[0],
      startTime: r.startTime,
      endTime: r.endTime,
      partySize: r.partySize,
      status: r.status,
      notes: r.notes ?? '',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload = { ...form, boardGameId: form.boardGameId ? +form.boardGameId : null, reservationDate: form.reservationDate + 'T00:00:00.000Z' };
      await api.put(`/reservations/${editing.id}`, payload);
      toast.success('Reservation updated');
      setEditing(null);
      fetchReservations();
    } catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to update'); }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try { await api.delete(`/reservations/${deleteId}`); toast.success('Deleted'); fetchReservations(); }
    catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to delete'); }
    finally { setDeleteId(null); }
  };

  const statusColor = (s: string): React.CSSProperties => {
    if (s === 'Confirmed') return { background: '#edf5ef', color: '#2d5a3d' };
    if (s === 'Cancelled') return { background: '#faeae3', color: '#7b2d1a' };
    return { background: '#fef8e7', color: '#7d5a00' };
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.pageHeader}>
        <h2 style={{ margin: 0 }}>{isAdmin ? 'All Reservations' : 'My Reservations'}</h2>
        {!isAdmin && <Link to="/reservations/new" style={styles.newBtn}>+ New Reservation</Link>}
      </div>

      <form onSubmit={handleSearch} style={styles.filters}>
        {isAdmin && (
          <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
            <option value="">All Statuses</option>
            <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
          </select>
        )}
        {isAdmin && <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
          <option value="date">Sort: Date</option>
          <option value="status">Sort: Status</option>
          <option value="totalcost">Sort: Cost</option>
        </select>
        <button type="button" onClick={() => setDescending(d => !d)} style={styles.sortBtn}>{descending ? '↓ Desc' : '↑ Asc'}</button>
        {isAdmin && <button type="submit" style={styles.searchBtn}>Filter</button>}
      </form>

      <div style={styles.list}>
        {data?.items.length === 0 && <p style={styles.empty}>No reservations found.</p>}
        {data?.items.map(r => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.resId}>Reservation #{r.id}</span>
              <span style={{ ...styles.badge, ...statusColor(r.status) }}>{r.status}</span>
            </div>
            <div style={styles.cardBody}>
              <div>
                <p style={styles.info}><strong>Table #{r.tableNumber}</strong></p>
                <p style={styles.info}>{new Date(r.reservationDate).toLocaleDateString()} · {r.startTime} – {r.endTime}</p>
                <p style={styles.info}>Party of {r.partySize}</p>
                {r.boardGameTitle && <p style={styles.info}>Game: {r.boardGameTitle}</p>}
                {r.notes && <p style={styles.note}>{r.notes}</p>}
              </div>
              <div style={styles.costArea}>
                <p style={styles.cost}>€{r.totalCost.toFixed(2)}</p>
                {isAdmin && <p style={styles.user}>{r.userName}</p>}
                <div style={styles.actions}>
                  <button onClick={() => openEdit(r)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => setDeleteId(r.id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      <p style={styles.count}>{data?.totalCount ?? 0} reservations</p>

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Reservation"
          message="Are you sure you want to delete this reservation? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editing && (
        <div style={styles.modal}>
          <form onSubmit={handleUpdate} style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Edit Reservation #{editing.id}</h3>
            <select value={form.tableId} onChange={e => setForm(f => ({ ...f, tableId: +e.target.value }))} style={styles.modalInput} required>
              {tables.map(t => <option key={t.id} value={t.id}>Table #{t.tableNumber}</option>)}
            </select>
            <select value={form.boardGameId} onChange={e => setForm(f => ({ ...f, boardGameId: e.target.value }))} style={styles.modalInput}>
              <option value="">No game</option>
              {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
            <input type="date" value={form.reservationDate} onChange={e => setForm(f => ({ ...f, reservationDate: e.target.value }))} required style={styles.modalInput} />
            <div style={styles.row}>
              <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required style={styles.modalInput} />
              <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required style={styles.modalInput} />
            </div>
            <input type="number" placeholder="Party Size" value={form.partySize} onChange={e => setForm(f => ({ ...f, partySize: +e.target.value }))} min={1} max={20} required style={styles.modalInput} />
            {isAdmin && (
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={styles.modalInput} required>
                <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
              </select>
            )}
            <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} maxLength={500} style={{ ...styles.modalInput, height: '70px' }} />
            <div style={styles.row}>
              <button type="submit" style={styles.saveBtn}>Save</button>
              <button type="button" onClick={() => setEditing(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: '900px', margin: '0 auto', padding: '1.75rem 1.5rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  newBtn: { padding: '0.55rem 1.1rem', background: '#b85c38', color: '#fff', borderRadius: '7px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' },
  input: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', flex: 1, minWidth: '120px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const },
  select: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', background: '#fffdf8', color: '#2c1d12' },
  sortBtn: { padding: '0.55rem 0.85rem', background: '#f5ece0', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', color: '#7a5c44', fontWeight: 600 },
  searchBtn: { padding: '0.55rem 1.1rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  empty: { textAlign: 'center', color: '#a08470', padding: '3rem', background: '#fffdf8', borderRadius: '12px', border: '1px solid #e2cdb9' },
  card: { background: '#fffdf8', borderRadius: '12px', padding: '1.1rem 1.25rem', boxShadow: '0 2px 10px rgba(62,30,10,0.08)', border: '1px solid #e2cdb9' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' },
  resId: { fontWeight: 700, color: '#2c1d12' },
  badge: { fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '12px', fontWeight: 700 },
  cardBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' },
  info: { margin: '0.15rem 0', fontSize: '0.9rem', color: '#7a5c44' },
  note: { margin: '0.15rem 0', fontSize: '0.82rem', color: '#a08470', fontStyle: 'italic' },
  costArea: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' },
  cost: { margin: 0, fontWeight: 700, fontSize: '1.15rem', color: '#b85c38' },
  user: { margin: 0, fontSize: '0.8rem', color: '#a08470' },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.3rem 0.65rem', background: '#f0f7f3', color: '#2d5a3d', border: '1px solid #c5dece', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
  deleteBtn: { padding: '0.3rem 0.65rem', background: '#faeae3', color: '#7b2d1a', border: '1px solid #f0c4b0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
  count: { textAlign: 'center', color: '#a08470', fontSize: '0.85rem', marginTop: '0.5rem' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(44,29,18,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, padding: '2rem 1rem', overflowY: 'auto' },
  modalCard: { background: '#fffdf8', padding: '2rem', borderRadius: '14px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 'auto', border: '1px solid #e2cdb9', boxShadow: '0 8px 32px rgba(44,29,18,0.18)' },
  modalTitle: { margin: '0 0 0.25rem', color: '#2c1d12' },
  modalInput: { padding: '0.6rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const },
  row: { display: 'flex', gap: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.65rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { flex: 1, padding: '0.65rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', fontWeight: 600 },
};
