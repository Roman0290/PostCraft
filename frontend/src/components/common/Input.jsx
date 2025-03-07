export default function Input({ label, error, as = 'input', id, hint, ...props }) {
  const Tag = as;
  const inputId = id || props.name;
  return (
    <div className="field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <Tag id={inputId} className={`input ${error ? 'input-error' : ''}`} aria-invalid={Boolean(error)} {...props} />
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}
