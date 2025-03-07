import { NavLink, Outlet } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard">
      <aside className="dash-nav card">
        <div className="dash-user">
          <Avatar name={user.name} size={44} />
          <div>
            <strong>{user.name}</strong>
            <div className="muted small">{user.is_admin ? 'Administrator' : 'Author'}</div>
          </div>
        </div>
        <nav>
          <NavLink to="/dashboard" end>My posts</NavLink>
          <NavLink to="/dashboard/posts/new">New post</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          {user.is_admin && <NavLink to="/dashboard/categories">Categories</NavLink>}
        </nav>
      </aside>
      <section className="dash-content">
        <Outlet />
      </section>
    </div>
  );
}
