import { useState } from 'react';

const INITIAL_TASKS = [
  { id: 1, title: 'Set up project structure',  description: 'Initialize Node.js and Express',               status: 'completed',   priority: 'high',   category: 'Backend',  due_date: '2026-01-10' },
  { id: 2, title: 'Design database schema',     description: 'Create tables for users, tasks, categories',  status: 'completed',   priority: 'high',   category: 'Database', due_date: '2026-01-12' },
  { id: 3, title: 'Build REST API endpoints',   description: 'CRUD routes for all resources',               status: 'completed',   priority: 'high',   category: 'Backend',  due_date: '2026-01-20' },
  { id: 4, title: 'Write unit tests',           description: 'Test all API endpoints with Postman',         status: 'in_progress', priority: 'medium', category: 'Backend',  due_date: '2026-02-01' },
  { id: 5, title: 'Deploy to Render',           description: 'Configure environment variables on Render',   status: 'pending',     priority: 'medium', category: 'DevOps',   due_date: '2026-02-05' },
  { id: 6, title: 'Build React frontend',       description: 'Sprint 2 — component-based SPA with Vite',   status: 'in_progress', priority: 'high',   category: 'Frontend', due_date: '2026-03-26' },
  { id: 7, title: 'Style the UI',               description: 'Apply global CSS styles',                     status: 'completed',   priority: 'low',    category: 'Frontend', due_date: '2026-03-20' },
  { id: 8, title: 'Final deployment',           description: 'Deploy full-stack application to production',  status: 'pending',     priority: 'medium', category: 'DevOps',   due_date: '2026-04-10' },
];

const CATS = ['Backend', 'Frontend', 'Database', 'DevOps', 'Design', 'Other'];
const EMPTY = { title: '', description: '', status: 'pending', priority: 'medium', due_date: '', category: '' };
let nextId = 9;

export default function TasksScreen() {
  const [tasks,     setTasks]     = useState(INITIAL_TASKS);
  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData,  setFormData]  = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [filter,    setFilter]    = useState('');

  const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date || '',
      category: t.category || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY);
    setFormError('');
  };

  const handleChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError('Title is required'); return; }
    if (editingId) {
      setTasks(p => p.map(t => t.id === editingId ? { ...t, ...formData } : t));
    } else {
      setTasks(p => [...p, { id: nextId++, ...formData }]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks(p => p.filter(t => t.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>New task</button>
      </header>

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <h2 className="form-panel-title">{editingId ? 'Edit task' : 'New task'}</h2>
            <button className="btn-ghost" onClick={closeForm}>Cancel</button>
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-row">
              <div className="field field-grow">
                <label className="field-label">Title *</label>
                <input
                  name="title"
                  className="field-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Status</label>
                <select name="status" className="field-input" value={formData.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">Priority</label>
                <select name="priority" className="field-input" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label className="field-label">Description</label>
              <textarea
                name="description"
                className="field-input field-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label className="field-label">Due date</label>
                <input name="due_date" type="date" className="field-input" value={formData.due_date} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="field-label">Category</label>
                <select name="category" className="field-input" value={formData.category} onChange={handleChange}>
                  <option value="">None</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update task' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        {['', 'pending', 'in_progress', 'completed'].map(s => (
          <button
            key={s}
            className={'filter-btn' + (filter === s ? ' active' : '')}
            onClick={() => setFilter(s)}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found.</p>
          <button className="btn-primary" onClick={openCreate}>Add your first task</button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Due date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="td-main">
                  <span className="task-title">{t.title}</span>
                  {t.description && <span className="task-desc">{t.description}</span>}
                </td>
                <td>
                  <span className={'tag tag-' + t.status}>{t.status.replace('_', ' ')}</span>
                </td>
                <td>
                  <span className={'priority priority-' + t.priority}>{t.priority}</span>
                </td>
                <td className="td-muted">{t.category || '—'}</td>
                <td className="td-muted">{t.due_date || '—'}</td>
                <td className="td-actions">
                  <button className="action-btn" onClick={() => openEdit(t)}>Edit</button>
                  <button className="action-btn action-btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
