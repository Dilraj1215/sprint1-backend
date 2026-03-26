import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">TF</span>
        <span className="brand-name">TaskFlow</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Overview</NavLink>
        <NavLink to="/tasks"     className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Tasks</NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Categories</NavLink>
      </nav>
      <div className="sidebar-footer">
        {user && (
          <>
            <p className="sidebar-user">{user.username}</p>
            <p className="sidebar-email">{user.email}</p>
          </>
        )}
        <button className="logout-btn" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );
}
