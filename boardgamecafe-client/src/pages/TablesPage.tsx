import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { CafeTable, PagedResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

const statusStyle = (s: string): React.CSSProperties => {
  if (s === 'Available') return { background: '#edf5ef', color: '#2d5a3d' };
  if (s === 'Reserved') return { background: '#fef8e7', color: '#7d5a00' };
  if (s === 'Occupied') return { background: '#faeae3', color: '#7b2d1a' };
  return { background: '#f0ece8', color: '#6b5a4e' }; // Maintenance
};

export default function TablesPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<PagedResult<CafeTable> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [locationZone, setLocationZone] = useState('');
  const [sortBy, setSortBy] = useState('tablenumber');
  const [descending, setDescending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CafeTable | null>(null);
  const [form, setForm] = useState(defaultForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function defaultForm() {
    return { tableNumber: 1, capacity: 4, isVIP: false, hourlyRate: 5, status: 'Available', locationZone: 'Main Hall', description: '' };
  }

  const fetchTables = async () => {
    try {
      const { data: res } = await api.get('/tables', { params: { status, locationZone, page, pageSize: 6, sortBy, descending } });
      setData(res);
    } catch { toast.error('Failed to load tables'); }
  };

  useEffect(() => { fetchTables(); }, [page, sortBy, descending]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchTables(); };

  const openCreate = () => { setEditing(null); setForm(defaultForm()); setShowForm(true); };
  const openEdit = (t: CafeTable) => { setEditing(t); setForm({ ...t, description: t.description || '' }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/tables/${editing.id}`, form); toast.success('Table updated'); }
      else { await api.post('/tables', form); toast.success('Table added'); }
      setShowForm(false); fetchTables();
    } catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to save'); }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try { await api.delete(`/tables/${deleteId}`); toast.success('Deleted'); fetchTables(); }
    catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to delete'); }
    finally { setDeleteId(null); }
  };

  const handleReserve = (t: CafeTable) => {
    if (!user) { navigate('/login'); return; }
    navigate(`/reservations/new?tableId=${t.id}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Tables</h2>
        {isAdmin && <button onClick={openCreate} style={styles.addBtn}>+ Add Table</button>}
      </div>

      <form onSubmit={handleSearch} style={styles.filters}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
          <option value="">All Statuses</option>
          <option>Available</option><option>Occupied</option><option>Reserved</option><option>Maintenance</option>
        </select>
        <input placeholder="Filter by zone…" value={locationZone} onChange={e => setLocationZone(e.target.value)} style={styles.input} maxLength={50} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
          <option value="tablenumber">Sort: Number</option>
          <option value="capacity">Sort: Capacity</option>
          <option value="hourlyrate">Sort: Rate</option>
        </select>
        <button type="button" onClick={() => setDescending(d => !d)} style={styles.sortBtn}>{descending ? '↓ Desc' : '↑ Asc'}</button>
        <button type="submit" style={styles.searchBtn}>Filter</button>
      </form>

      <div style={styles.grid}>
        {data?.items.map(t => (
          <div key={t.id} style={{ ...styles.card, borderTop: t.isVIP ? '4px solid #a855f7' : '4px solid #e2cdb9' }}>
            {t.isVIP && <span style={styles.vipBadge}>★ VIP</span>}
            <h3 style={styles.tableNum}>Table #{t.tableNumber}</h3>
            <p style={styles.zone}>{t.locationZone}</p>
            <p style={styles.info}>Capacity: <strong>{t.capacity}</strong> people</p>
            <p style={styles.info}>Rate: <strong>€{t.hourlyRate}/hr</strong></p>
            <span style={{ ...styles.statusChip, ...statusStyle(t.status) }}>{t.status}</span>
            {t.description && <p style={styles.desc}>{t.description}</p>}
            <div style={styles.actions}>
              {t.status === 'Available' && <button onClick={() => handleReserve(t)} style={styles.reserveBtn}>Reserve</button>}
              {isAdmin && <>
                <button onClick={() => openEdit(t)} style={styles.editBtn}>Edit</button>
                <button onClick={() => setDeleteId(t.id)} style={styles.deleteBtn}>Delete</button>
              </>}
            </div>
          </div>
        ))}
      </div>

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      <p style={styles.count}>{data?.totalCount ?? 0} tables total</p>

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Table"
          message="Are you sure you want to delete this table? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {showForm && (
        <div style={styles.modal}>
          <form onSubmit={handleSubmit} style={styles.modalCard}>
            <h3 style={styles.modalTitle}>{editing ? 'Edit Table' : 'Add Table'}</h3>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Table Number</span>
              <input type="number" value={form.tableNumber} onChange={e => setForm(f => ({ ...f, tableNumber: +e.target.value }))} required min={1} style={styles.modalInput} />
            </div>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Capacity — how many people it seats</span>
              <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} required min={1} max={20} style={styles.modalInput} />
            </div>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Hourly Rate (€) — price charged per hour</span>
              <input type="number" step="0.5" value={form.hourlyRate} onChange={e => setForm(f => ({ ...f, hourlyRate: +e.target.value }))} min={0} style={styles.modalInput} />
            </div>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Status</span>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={styles.modalInput}>
                <option>Available</option><option>Occupied</option><option>Reserved</option><option>Maintenance</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Location Zone — area of the cafe</span>
              <input value={form.locationZone} onChange={e => setForm(f => ({ ...f, locationZone: e.target.value }))} required maxLength={50} style={styles.modalInput} />
            </div>
            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Description (optional)</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={200} style={{ ...styles.modalInput, height: '70px' }} />
            </div>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.isVIP} onChange={e => setForm(f => ({ ...f, isVIP: e.target.checked }))} />
              VIP Table
            </label>
            <div style={styles.row}>
              <button type="submit" style={styles.saveBtn}>Save</button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '1.75rem 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  pageTitle: { margin: 0 },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' },
  input: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', flex: 1, minWidth: '140px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const },
  select: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', background: '#fffdf8', color: '#2c1d12' },
  sortBtn: { padding: '0.55rem 0.85rem', background: '#f5ece0', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', color: '#7a5c44', fontWeight: 600 },
  searchBtn: { padding: '0.55rem 1.1rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  addBtn: { padding: '0.55rem 1.1rem', background: '#4a7c59', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' },
  card: { background: '#fffdf8', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(62,30,10,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative', border: '1px solid #e2cdb9' },
  vipBadge: { position: 'absolute', top: '0.6rem', right: '0.6rem', background: '#a855f7', color: '#fff', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700 },
  tableNum: { margin: 0, fontSize: '1.1rem', color: '#2c1d12' },
  zone: { margin: 0, fontSize: '0.8rem', color: '#a08470' },
  info: { margin: 0, fontSize: '0.9rem', color: '#7a5c44' },
  statusChip: { fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '12px', display: 'inline-block', width: 'fit-content', fontWeight: 600 },
  desc: { margin: 0, fontSize: '0.8rem', color: '#a08470', lineHeight: 1.5 },
  actions: { display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' },
  reserveBtn: { flex: 2, padding: '0.45rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  editBtn: { flex: 1, padding: '0.35rem', background: '#f0f7f3', color: '#2d5a3d', border: '1px solid #c5dece', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  deleteBtn: { flex: 1, padding: '0.35rem', background: '#faeae3', color: '#7b2d1a', border: '1px solid #f0c4b0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  count: { textAlign: 'center', color: '#a08470', fontSize: '0.85rem', marginTop: '0.5rem' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(44,29,18,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, padding: '2rem 1rem', overflowY: 'auto' },
  modalCard: { background: '#fffdf8', padding: '2rem', borderRadius: '14px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: 'auto', border: '1px solid #e2cdb9', boxShadow: '0 8px 32px rgba(44,29,18,0.18)' },
  fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '0.25rem' },
  fieldLabel: { fontSize: '0.82rem', fontWeight: 600, color: '#7a5c44' },
  modalTitle: { margin: '0 0 0.25rem', color: '#2c1d12' },
  modalInput: { padding: '0.6rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const },
  checkLabel: { display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#7a5c44', fontWeight: 600, fontSize: '0.9rem' },
  row: { display: 'flex', gap: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.65rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { flex: 1, padding: '0.65rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', fontWeight: 600 },
};
