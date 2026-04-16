import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api/client';

const EMPTY_FORM = { name: '', description: '' };

export default function CategoriesScreen() {
  const [cats,      setCats]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData,  setFormData]  = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError('');
    try {
      const res = await categoriesAPI.getAllWithCounts();
      setCats(res.data);
    } catch (err) {
      setError('Failed to load categories. ' + err.message);
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

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
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
    if (!formData.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name:        formData.name.trim(),
        description: formData.description.trim(),
      };
      if (editingId) {
        const res = await categoriesAPI.update(editingId, payload);
        setCats((prev) =>
          prev.map((c) => (c.id === editingId ? { ...res.data, tasks_count: c.tasks_count } : c))
        );
      } else {
        const res = await categoriesAPI.create(payload);
        setCats((prev) => [...prev, { ...res.data, tasks_count: 0 }]);
      }
      closeForm();
    } catch (err) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Tasks in it will lose their category.')) return;
    try {
      await categoriesAPI.delete(id);
      setCats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">
            {cats.length} categor{cats.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>New category</button>
      </header>

      {error && <div className="form-error" style={{ margin: '0 0 16px' }}>{error}</div>}

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <h2 className="form-panel-title">
              {editingId ? 'Edit category' : 'New category'}
            </h2>
            <button className="btn-ghost" onClick={closeForm}>Cancel</button>
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-row">
              <div className="field field-grow">
                <label className="field-label">Name *</label>
                <input
                  name="name"
                  className="field-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Category name"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Description</label>
              <input
                name="description"
                className="field-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update category' : 'Create category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {cats.length === 0 ? (
        <div className="empty-state">
          <p>No categories yet.</p>
          <button className="btn-primary" onClick={openCreate}>
            Add your first category
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Tasks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td className="td-main">{c.name}</td>
                <td className="td-muted">{c.description || '—'}</td>
                <td className="td-muted">{c.tasks_count}</td>
                <td className="td-actions">
                  <button className="action-btn" onClick={() => openEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="action-btn action-btn-danger"
                    onClick={() => handleDelete(c.id)}
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
