// Base URL: use relative path so the same code works both in dev (via Vite proxy)
// and in production (Express serves both API and frontend on the same origin).
const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Auth
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

// Tasks
export const tasksAPI = {
  getAll: (params = '') => request(`/tasks${params}`),
  getStats: () => request('/tasks/stats'),
  getById: (id) => request(`/tasks/${id}`),
  create: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// Categories
export const categoriesAPI = {
  getAll: () => request('/categories'),
  getAllWithCounts: () => request('/categories/counts'),
  create: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

// Users
export const usersAPI = {
  getAll: () => request('/users'),
  getById: (id) => request(`/users/${id}`),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
