/** Works with Laravel's paginator `meta` ({ current_page, last_page }). */
export default function Pagination({ meta, onChange }) {
  if (!meta || meta.last_page <= 1) return null;
  const { current_page: page, last_page: last } = meta;

  const pages = [];
  for (let p = 1; p <= last; p++) {
    if (p === 1 || p === last || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      {pages.map((p, i) =>
        p === '…' ? <span key={`gap-${i}`} className="page-gap">…</span> : (
          <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button className="page-btn" disabled={page === last} onClick={() => onChange(page + 1)}>Next →</button>
    </nav>
  );
}
