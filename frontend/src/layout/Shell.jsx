import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import Sidebar from './Sidebar';

export default function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
