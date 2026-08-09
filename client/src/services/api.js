import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

const extractMessage = (error, fallback) => {
  const msg = error?.response?.data?.message;
  if (msg && typeof msg === 'string') return msg;
  return fallback;
};

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (formData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const stockApi = {
  addStock: (id, data) => api.post(`/products/${id}/add-stock`, data),
  outStock: (id, data) => api.post(`/products/${id}/out-stock`, data),
  getMovements: (id) => api.get(`/products/${id}/movements`),
};

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  extractMessage(error, fallback);

export default api;
