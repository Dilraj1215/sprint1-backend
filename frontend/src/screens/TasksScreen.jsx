import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../api/client';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  category_id: '',
};

export default function TasksScreen() {
  const [tasks,      setTasks]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [formError,  setFormError]  = useState('');
  const [saving,     setSaving]     = useState(false);
  const [filter,     setFilter]     = useState('');

  // Load tasks and categories on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, catsRes] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setTasks(tasksRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      setError('Failed to load tasks. ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditingId(task.id);
    setFormData({
      title:       task.title || '',
      description: task.description || '',
      status:      task.status || 'pending',
      priority:    task.priority || 'medium',
      due_date:    task.due_date ? task.due_date.split('T')[0] : '',
      category_id: task.category_id || '',
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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        title:       formData.title.trim(),
        description: formData.description.trim(),
        status:      formData.status,
        priority:    formData.priority,
        due_date:    formData.due_date || null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
      };

      if (editingId) {
        const res = await tasksAPI.update(editingId, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingId ? res.data : t))
        );
      } else {
        const res = await tasksAPI.create(payload);
        setTasks((prev) => [res.data, ...prev]);
      }
      closeForm();
    } catch (err) {
      setFormError(err.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>New task</button>
      </header>

      {error && <div className="form-error" style={{ margin: '0 0 16px' }}>{error}</div>}

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <h2 className="form-panel-title">
              {editingId ? 'Edit task' : 'New task'}
            </h2>
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
                <select
                  name="status"
                  className="field-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">Priority</label>
                <select
                  name="priority"
                  className="field-input"
                  value={formData.priority}
                  onChange={handleChange}
                >
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
                <select
                  name="category_id"
                  className="field-input"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update task' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        {['', 'pending', 'in_progress', 'completed'].map((s) => (
          <button
            key={s}
            className={`filter-btn${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found.</p>
          <button className="btn-primary" onClick={openCreate}>
            Add your first task
          </button>
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
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="td-main">
                  <span className="task-title">{t.title}</span>
                  {t.description && (
                    <span className="task-desc">{t.description}</span>
                  )}
                </td>
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
                <td className="td-muted">{t.category_name || '—'}</td>
                <td className="td-muted">
                  {t.due_date ? t.due_date.split('T')[0] : '—'}
                </td>
                <td className="td-actions">
                  <button className="action-btn" onClick={() => openEdit(t)}>
                    Edit
                  </button>
                  <button
                    className="action-btn action-btn-danger"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
