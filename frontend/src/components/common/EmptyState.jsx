export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {children && <div className="muted">{children}</div>}
    </div>
  );
}
