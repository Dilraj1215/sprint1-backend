import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI, usersAPI } from '../api/client';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  category_id: '',
  user_id: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAll();
  }, [filterStatus]);

  async function fetchAll() {
    setLoading(true);
    try {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const [tasksRes, catsRes, usersRes] = await Promise.all([
        tasksAPI.getAll(params),
        categoriesAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setTasks(tasksRes.data);
      setCategories(catsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      due_date: task.due_date ? task.due_date.slice(0, 10) : '',
      category_id: task.category_id || '',
      user_id: task.user_id || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || null,
        user_id: formData.user_id || null,
        due_date: formData.due_date || null,
      };
      if (editingId) {
        await tasksAPI.update(editingId, payload);
      } else {
        await tasksAPI.create(payload);
      }
      closeForm();
      fetchAll();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>New task</button>
      </header>

      {/* Inline form panel */}
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
                <input
                  name="due_date"
                  type="date"
                  className="field-input"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label className="field-label">Category</label>
                <select name="category_id" className="field-input" value={formData.category_id} onChange={handleChange}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Assign to</label>
                <select name="user_id" className="field-input" value={formData.user_id} onChange={handleChange}>
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update task' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Filter by status:</span>
        {['', 'pending', 'in_progress', 'completed'].map((s) => (
          <button
            key={s}
            className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task table */}
      {loading ? (
        <div className="page-loading">Loading tasks...</div>
      ) : error ? (
        <div className="page-error">{error}</div>
      ) : tasks.length === 0 ? (
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
              <th>Assigned</th>
              <th>Due date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td className="td-main">
                  <span className="task-title">{t.title}</span>
                  {t.description && <span className="task-desc">{t.description}</span>}
                </td>
                <td><span className={`tag tag-${t.status}`}>{t.status.replace('_', ' ')}</span></td>
                <td><span className={`priority priority-${t.priority}`}>{t.priority}</span></td>
                <td className="td-muted">{t.category_name || '—'}</td>
                <td className="td-muted">{t.username || '—'}</td>
                <td className="td-muted">
                  {t.due_date ? new Date(t.due_date).toLocaleDateString('en-CA') : '—'}
                </td>
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
