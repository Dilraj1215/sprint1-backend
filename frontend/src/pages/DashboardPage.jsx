import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI, categoriesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, catsRes, tasksRes] = await Promise.all([
          tasksAPI.getStats(),
          categoriesAPI.getAllWithCounts(),
          tasksAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setCategories(catsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const completionRate =
    stats && Number(stats.total_tasks) > 0
      ? Math.round((Number(stats.completed_tasks) / Number(stats.total_tasks)) * 100)
      : 0;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Welcome back, {user?.username}</p>
        </div>
        <Link to="/tasks" className="btn-primary">New task</Link>
      </header>

      {/* Stat cards */}
      <section className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total tasks</span>
          <span className="stat-value">{stats?.total_tasks ?? 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats?.pending_tasks ?? 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In progress</span>
          <span className="stat-value">{stats?.in_progress_tasks ?? 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats?.completed_tasks ?? 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completion rate</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">High priority</span>
          <span className="stat-value">{stats?.high_priority_tasks ?? 0}</span>
        </div>
      </section>

      <div className="dashboard-cols">
        {/* Recent tasks */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent tasks</h2>
            <Link to="/tasks" className="panel-link">View all</Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="empty-note">No tasks yet. <Link to="/tasks">Add one</Link></p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td className="td-main">{t.title}</td>
                    <td><span className={`tag tag-${t.status}`}>{t.status.replace('_', ' ')}</span></td>
                    <td><span className={`priority priority-${t.priority}`}>{t.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Categories */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Categories</h2>
            <Link to="/categories" className="panel-link">Manage</Link>
          </div>
          {categories.length === 0 ? (
            <p className="empty-note">No categories yet. <Link to="/categories">Add one</Link></p>
          ) : (
            <ul className="category-list">
              {categories.map((c) => (
                <li key={c.id} className="category-item">
                  <span className="category-name">{c.name}</span>
                  <span className="category-count">{c.tasks_count} task{c.tasks_count !== '1' ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
