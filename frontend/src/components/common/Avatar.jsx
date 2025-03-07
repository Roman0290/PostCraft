import { initials } from '../../utils/formatDate';

export default function Avatar({ name, size = 36 }) {
  // Stable color per name
  const hue = [...(name || '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 55% 45%)` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
