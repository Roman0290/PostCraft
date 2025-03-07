import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  };

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand"><span className="brand-mark">I</span>{APP_NAME}</Link>

        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>☰</button>

        <div className={`nav-collapse ${menuOpen ? 'open' : ''}`} onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
          <form className="nav-search" onSubmit={onSearch} role="search">
            <input type="search" placeholder="Search posts…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search posts" />
          </form>

          <nav className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <Button to="/dashboard/posts/new" size="sm">Write</Button>
                <span className="nav-user" title={user.email}><Avatar name={user.name} size={30} /></span>
                <button className="link-btn" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <Button to="/register" size="sm">Sign up</Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
