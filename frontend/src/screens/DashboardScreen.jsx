import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const RECENT_TASKS = [
  { id: 1, title: 'Set up project structure',  status: 'completed',  priority: 'high'   },
  { id: 2, title: 'Design database schema',     status: 'completed',  priority: 'high'   },
  { id: 3, title: 'Build REST API endpoints',   status: 'completed',  priority: 'high'   },
  { id: 4, title: 'Write unit tests',           status: 'in_progress',priority: 'medium' },
  { id: 5, title: 'Deploy to Render',           status: 'pending',    priority: 'medium' },
];

const STATS = {
  total:      8,
  pending:    2,
  in_progress:2,
  completed:  4,
  high:       3,
  rate:       50,
};

const CATEGORIES = [
  { id: 1, name: 'Backend',  count: 3 },
  { id: 2, name: 'Frontend', count: 2 },
  { id: 3, name: 'Database', count: 2 },
  { id: 4, name: 'DevOps',   count: 1 },
];

export default function DashboardScreen() {
  const { user } = useAuth();

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
          ['Total tasks',     STATS.total],
          ['Pending',         STATS.pending],
          ['In progress',     STATS.in_progress],
          ['Completed',       STATS.completed],
          ['Completion rate', STATS.rate + '%'],
          ['High priority',   STATS.high],
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
          <table className="data-table" style={{ margin: '0 18px', width: 'calc(100% - 36px)' }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TASKS.map(t => (
                <tr key={t.id}>
                  <td className="td-main">{t.title}</td>
                  <td><span className={'tag tag-' + t.status}>{t.status.replace('_', ' ')}</span></td>
                  <td><span className={'priority priority-' + t.priority}>{t.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Categories</h2>
            <Link to="/categories" className="panel-link">Manage</Link>
          </div>
          <ul className="category-list">
            {CATEGORIES.map(c => (
              <li key={c.id} className="category-item">
                <span className="category-name">{c.name}</span>
                <span className="category-count">{c.count} tasks</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}