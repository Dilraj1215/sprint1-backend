import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { tasksAPI, categoriesAPI } from '../api/client';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, tasksRes, catsRes] = await Promise.all([
          tasksAPI.getStats(),
          tasksAPI.getAll(),
          categoriesAPI.getAllWithCounts(),
        ]);
        setStats(statsRes.data);
        // Show the 5 most recent tasks
        setRecentTasks(tasksRes.data.slice(0, 5));
        setCategories(catsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="form-error">{error}</div>
      </div>
    );
  }

  const total       = Number(stats?.total_tasks) || 0;
  const pending     = Number(stats?.pending_tasks) || 0;
  const inProgress  = Number(stats?.in_progress_tasks) || 0;
  const completed   = Number(stats?.completed_tasks) || 0;
  const highPriority = Number(stats?.high_priority_tasks) || 0;
  const rate        = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Welcome back, {user?.username}</p>
        </div>
        <Link to="/tasks" className="btn-primary">New task</Link>
      </header>

      <section className="stat-grid">
        {[
          ['Total tasks',     total],
          ['Pending',         pending],
          ['In progress',     inProgress],
          ['Completed',       completed],
          ['Completion rate', `${rate}%`],
          ['High priority',   highPriority],
        ].map(([label, val]) => (
          <div className="stat-card" key={label}>
            <span className="stat-label">{label}</span>
            <span className="stat-value">{val}</span>
          </div>
        ))}
      </section>

      <div className="dashboard-cols">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent tasks</h2>
            <Link to="/tasks" className="panel-link">View all</Link>
          </div>
          {recentTasks.length === 0 ? (
            <p style={{ padding: '0 18px', color: 'var(--muted)' }}>No tasks yet.</p>
          ) : (
            <table className="data-table" style={{ margin: '0 18px', width: 'calc(100% - 36px)' }}>
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
                    <td>
                      <span className={`tag tag-${t.status}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`priority priority-${t.priority}`}>
                        {t.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Categories</h2>
            <Link to="/categories" className="panel-link">Manage</Link>
          </div>
          {categories.length === 0 ? (
            <p style={{ padding: '0 18px', color: 'var(--muted)' }}>No categories yet.</p>
          ) : (
            <ul className="category-list">
              {categories.map((c) => (
                <li key={c.id} className="category-item">
                  <span className="category-name">{c.name}</span>
                  <span className="category-count">{c.tasks_count} tasks</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
