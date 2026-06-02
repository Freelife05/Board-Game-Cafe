interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '1.75rem', flexWrap: 'wrap' }}>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} style={{ ...btnStyle, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0.4rem 0.3rem', color: '#a08470', alignSelf: 'center' }}>…</span>
          : <button key={p} onClick={() => onPageChange(p)} style={{ ...btnStyle, background: p === page ? '#b85c38' : '#fffdf8', color: p === page ? '#fff' : '#7a5c44', border: p === page ? '1.5px solid #b85c38' : '1.5px solid #e2cdb9', fontWeight: p === page ? 700 : 500 }}>{p}</button>
      )}
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={{ ...btnStyle, opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: '0.45rem 0.9rem', border: '1.5px solid #e2cdb9', borderRadius: '7px', cursor: 'pointer', background: '#fffdf8', color: '#7a5c44', fontWeight: 600, fontSize: '0.9rem' };
