import { Link } from 'react-router-dom';

/** variant: primary | secondary | ghost | danger ; size: md | sm */
export default function Button({ to, variant = 'primary', size = 'md', loading, children, className = '', ...props }) {
  const classes = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spinner spinner-sm" aria-hidden="true" />}
      {children}
    </button>
  );
}
