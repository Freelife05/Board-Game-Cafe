import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { BoardGame, PagedResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

export default function GamesPage() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<PagedResult<BoardGame> | null>(null);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [descending, setDescending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BoardGame | null>(null);
  const [form, setForm] = useState(defaultForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailGame, setDetailGame] = useState<BoardGame | null>(null);

  function defaultForm() {
    return { title: '', genre: '', minPlayers: 2, maxPlayers: 4, difficultyLevel: 'Medium', playTimeMinutes: 60, condition: 'Good', pricePerHour: 3, isAvailable: true, imageUrl: '', description: '', fullDescription: '' };
  }

  const fetchGames = async () => {
    try {
      const { data: res } = await api.get('/boardgames', { params: { title, genre, page, pageSize: 8, sortBy, descending } });
      setData(res);
    } catch { toast.error('Failed to load games'); }
  };

  useEffect(() => { fetchGames(); }, [page, sortBy, descending]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchGames(); };

  const openCreate = () => { setEditing(null); setForm(defaultForm()); setShowForm(true); };
  const openEdit = (g: BoardGame) => {
    setEditing(g);
    setForm({ ...g, imageUrl: g.imageUrl || '', description: g.description || '', fullDescription: g.fullDescription || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/boardgames/${editing.id}`, form);
        toast.success('Game updated');
      } else {
        await api.post('/boardgames', form);
        toast.success('Game added');
      }
      setShowForm(false);
      fetchGames();
    } catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to save'); }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try { await api.delete(`/boardgames/${deleteId}`); toast.success('Deleted'); fetchGames(); }
    catch (err: any) { toast.error(err.response?.data?.detail || 'Failed to delete'); }
    finally { setDeleteId(null); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Board Games</h2>
        {isAdmin && <button onClick={openCreate} style={styles.addBtn}>+ Add Game</button>}
      </div>

      <form onSubmit={handleSearch} style={styles.filters}>
        <input placeholder="Search by title…" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} maxLength={100} />
        <input placeholder="Filter by genre…" value={genre} onChange={e => setGenre(e.target.value)} style={styles.input} maxLength={50} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
          <option value="title">Sort: Title</option>
          <option value="genre">Sort: Genre</option>
          <option value="priceperhour">Sort: Price</option>
          <option value="difficultylevel">Sort: Difficulty</option>
        </select>
        <button type="button" onClick={() => setDescending(d => !d)} style={styles.sortBtn}>{descending ? '↓ Desc' : '↑ Asc'}</button>
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.grid}>
        {data?.items.map(g => (
          <div key={g.id} style={styles.card}>
            {g.imageUrl && <img src={g.imageUrl} alt={g.title} style={styles.img} />}
            <h3 style={styles.gameTitle}>{g.title}</h3>
            <p style={styles.badge}>{g.genre} · {g.difficultyLevel}</p>
            <p style={styles.info}>{g.minPlayers}–{g.maxPlayers} players · {g.playTimeMinutes} min</p>
            <p style={styles.price}>€{g.pricePerHour}/hr</p>
            <span style={{ ...styles.statusChip, ...(g.isAvailable ? styles.statusAvail : styles.statusUnavail) }}>
              {g.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            {g.description && <p style={styles.desc}>{g.description}</p>}
            <div style={styles.actions}>
              <button onClick={() => setDetailGame(g)} style={styles.detailsBtn}>Details</button>
              {isAdmin && <>
                <button onClick={() => openEdit(g)} style={styles.editBtn}>Edit</button>
                <button onClick={() => setDeleteId(g.id)} style={styles.deleteBtn}>Delete</button>
              </>}
            </div>
          </div>
        ))}
      </div>

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      <p style={styles.count}>{data?.totalCount ?? 0} games total</p>

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Game"
          message="Are you sure you want to delete this game? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {detailGame && (
        <div style={styles.modal} onClick={() => setDetailGame(null)}>
          <div style={styles.detailCard} onClick={e => e.stopPropagation()}>
            {detailGame.imageUrl && <img src={detailGame.imageUrl} alt={detailGame.title} style={styles.detailImg} />}
            <div style={styles.detailHeader}>
              <h2 style={styles.detailTitle}>{detailGame.title}</h2>
              <span style={{ ...styles.statusChip, ...(detailGame.isAvailable ? styles.statusAvail : styles.statusUnavail) }}>
                {detailGame.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p style={styles.detailMeta}>{detailGame.genre} · {detailGame.difficultyLevel} · {detailGame.condition} condition</p>
            <div style={styles.detailStats}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Players</span>
                <span style={styles.statValue}>{detailGame.minPlayers}–{detailGame.maxPlayers}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Play Time</span>
                <span style={styles.statValue}>{detailGame.playTimeMinutes} min</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Price</span>
                <span style={styles.statValue}>€{detailGame.pricePerHour}/hr</span>
              </div>
            </div>
            {detailGame.description && (
              <p style={styles.detailShortDesc}>{detailGame.description}</p>
            )}
            <div style={styles.detailDivider} />
            <p style={styles.detailFullDesc}>{detailGame.fullDescription}</p>
            <button onClick={() => setDetailGame(null)} style={styles.detailCloseBtn}>Close</button>
          </div>
        </div>
      )}

      {showForm && (
        <div style={styles.modal}>
          <form onSubmit={handleSubmit} style={styles.modalCard}>
            <h3 style={styles.modalTitle}>{editing ? 'Edit Game' : 'Add Game'}</h3>

            <div style={styles.formGrid}>
              <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={100} style={styles.modalInput} />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Genre *</label>
                <input value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} required maxLength={50} style={styles.modalInput} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Min Players</label>
                <input type="number" value={form.minPlayers} onChange={e => setForm(f => ({ ...f, minPlayers: +e.target.value }))} required min={1} max={20} style={styles.modalInput} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Max Players</label>
                <input type="number" value={form.maxPlayers} onChange={e => setForm(f => ({ ...f, maxPlayers: +e.target.value }))} required min={1} max={20} style={styles.modalInput} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Difficulty</label>
                <select value={form.difficultyLevel} onChange={e => setForm(f => ({ ...f, difficultyLevel: e.target.value }))} style={styles.modalInput}>
                  <option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option>
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Condition</label>
                <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} style={styles.modalInput}>
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Play Time (min)</label>
                <input type="number" value={form.playTimeMinutes} onChange={e => setForm(f => ({ ...f, playTimeMinutes: +e.target.value }))} min={1} max={600} style={styles.modalInput} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Price per Hour (€)</label>
                <input type="number" step="0.5" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: +e.target.value }))} min={0} style={styles.modalInput} />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} maxLength={255} style={styles.modalInput} />
              </div>

              <label style={{ ...styles.checkLabel, gridColumn: 'span 2' }}>
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} />
                Available
              </label>

              <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Short Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={500} style={{ ...styles.modalInput, height: '80px' }} />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Full Description * (10–1000 characters)</label>
                <textarea value={form.fullDescription} onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))} required minLength={10} maxLength={1000} style={{ ...styles.modalInput, height: '130px' }} />
              </div>
            </div>

            <div style={{ ...styles.row, marginTop: '0.5rem' }}>
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
  input: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', flex: 1, minWidth: '140px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12' },
  select: { padding: '0.55rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', background: '#fffdf8', color: '#2c1d12' },
  sortBtn: { padding: '0.55rem 0.85rem', background: '#f5ece0', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', color: '#7a5c44', fontWeight: 600 },
  searchBtn: { padding: '0.55rem 1.1rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  addBtn: { padding: '0.55rem 1.1rem', background: '#4a7c59', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  card: { background: '#fffdf8', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(62,30,10,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid #e2cdb9' },
  img: { width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.25rem' },
  gameTitle: { margin: 0, fontSize: '1rem', color: '#2c1d12' },
  badge: { margin: 0, fontSize: '0.8rem', color: '#a08470' },
  info: { margin: 0, fontSize: '0.85rem', color: '#7a5c44' },
  price: { margin: 0, fontWeight: 700, color: '#b85c38', fontSize: '1rem' },
  statusChip: { fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '12px', display: 'inline-block', width: 'fit-content', fontWeight: 600 },
  statusAvail: { background: '#edf5ef', color: '#2d5a3d' },
  statusUnavail: { background: '#faeae3', color: '#7b2d1a' },
  desc: { margin: 0, fontSize: '0.8rem', color: '#a08470', lineHeight: 1.5 },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
  detailsBtn: { flex: 1, padding: '0.35rem', background: '#f5ece0', color: '#7a5c44', border: '1px solid #e2cdb9', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  editBtn: { flex: 1, padding: '0.35rem', background: '#f0f7f3', color: '#2d5a3d', border: '1px solid #c5dece', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  deleteBtn: { flex: 1, padding: '0.35rem', background: '#faeae3', color: '#7b2d1a', border: '1px solid #f0c4b0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  detailCard: { background: '#fffdf8', borderRadius: '16px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2cdb9', boxShadow: '0 8px 32px rgba(44,29,18,0.18)', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem' },
  detailImg: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' },
  detailHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' as const },
  detailTitle: { margin: 0, fontSize: '1.4rem', color: '#2c1d12' },
  detailMeta: { margin: 0, fontSize: '0.9rem', color: '#a08470' },
  detailStats: { display: 'flex', gap: '0.75rem' },
  statBox: { flex: 1, background: '#f5ece0', borderRadius: '8px', padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' },
  statLabel: { fontSize: '0.72rem', color: '#a08470', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  statValue: { fontSize: '1rem', fontWeight: 700, color: '#2c1d12' },
  detailShortDesc: { margin: 0, fontSize: '0.9rem', color: '#7a5c44', fontStyle: 'italic' },
  detailDivider: { height: '1px', background: '#e2cdb9' },
  detailFullDesc: { margin: 0, fontSize: '0.95rem', color: '#2c1d12', lineHeight: 1.7 },
  detailCloseBtn: { marginTop: '0.25rem', padding: '0.65rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' },
  count: { textAlign: 'center', color: '#a08470', fontSize: '0.85rem', marginTop: '0.5rem' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(44,29,18,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem' },
  modalCard: { background: '#fffdf8', padding: '2rem', borderRadius: '14px', width: '100%', maxWidth: '660px', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2cdb9', boxShadow: '0 8px 32px rgba(44,29,18,0.18)' },
  modalTitle: { margin: '0 0 0.25rem', color: '#2c1d12', fontSize: '1.2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#7a5c44' },
  modalInput: { padding: '0.6rem 0.8rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', fontSize: '0.95rem', background: '#fffdf8', color: '#2c1d12', resize: 'vertical' as const, width: '100%', boxSizing: 'border-box' as const },
  checkLabel: { display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#7a5c44', fontWeight: 600, fontSize: '0.9rem' },
  row: { display: 'flex', gap: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.65rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { flex: 1, padding: '0.65rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', fontWeight: 600 },
};
