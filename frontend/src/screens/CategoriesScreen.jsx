import { useState } from 'react';

const INITIAL_CATS = [
  { id: 1, name: 'Backend',  description: 'Server-side development tasks',  count: 3 },
  { id: 2, name: 'Frontend', description: 'UI and client-side tasks',        count: 2 },
  { id: 3, name: 'Database', description: 'Schema design and migrations',    count: 2 },
  { id: 4, name: 'DevOps',   description: 'Deployment and infrastructure',   count: 1 },
];

const EMPTY = { name: '', description: '' };
let nextId = 5;

export default function CategoriesScreen() {
  const [cats,      setCats]      = useState(INITIAL_CATS);
  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData,  setFormData]  = useState(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setFormData({ name: c.name, description: c.description || '' });
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
    if (!formData.name.trim()) { setFormError('Name is required'); return; }
    if (editingId) {
      setCats(p => p.map(c => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      setCats(p => [...p, { id: nextId++, count: 0, ...formData }]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) return;
    setCats(p => p.filter(c => c.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{cats.length} categor{cats.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>New category</button>
      </header>

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <h2 className="form-panel-title">{editingId ? 'Edit category' : 'New category'}</h2>
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
              <button type="submit" className="btn-primary">
                {editingId ? 'Update category' : 'Create category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {cats.length === 0 ? (
        <div className="empty-state">
          <p>No categories yet.</p>
          <button className="btn-primary" onClick={openCreate}>Add your first category</button>
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
            {cats.map(c => (
              <tr key={c.id}>
                <td className="td-main">{c.name}</td>
                <td className="td-muted">{c.description || '—'}</td>
                <td className="td-muted">{c.count}</td>
                <td className="td-actions">
                  <button className="action-btn" onClick={() => openEdit(c)}>Edit</button>
                  <button className="action-btn action-btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
