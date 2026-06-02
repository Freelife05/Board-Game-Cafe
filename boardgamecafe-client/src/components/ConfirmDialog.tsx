interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.card} onClick={e => e.stopPropagation()}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>🗑</span>
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={styles.deleteBtn}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(44,29,18,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' },
  card: { background: '#fffdf8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 12px 40px rgba(44,29,18,0.22)', border: '1px solid #e2cdb9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '50%', background: '#faeae3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' },
  icon: { fontSize: '1.6rem' },
  title: { margin: 0, color: '#2c1d12', fontSize: '1.25rem' },
  message: { margin: 0, color: '#7a5c44', fontSize: '0.95rem', lineHeight: 1.6 },
  actions: { display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' },
  cancelBtn: { flex: 1, padding: '0.7rem', background: '#f5ece0', color: '#7a5c44', border: '1.5px solid #e2cdb9', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' },
  deleteBtn: { flex: 1, padding: '0.7rem', background: '#b85c38', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 3px 8px rgba(184,92,56,0.3)' },
};
