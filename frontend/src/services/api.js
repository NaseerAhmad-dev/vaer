import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vaer_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vaer_token');
      globalThis.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

export const productAPI = {
  getAll:      (params) => api.get('/products', { params }),
  getFeatured: ()       => api.get('/products/featured'),
  getOne:      (id)     => api.get(`/products/${id}`),
  create:      (data)   => api.post('/products', data),
  update:      (id, data) => api.put(`/products/${id}`, data),
  remove:      (id)     => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create:    (data)        => api.post('/orders', data),
  myOrders:  ()            => api.get('/orders/myorders'),
  getOne:    (id)          => api.get(`/orders/${id}`),
  getAll:    ()            => api.get('/orders'),
  setStatus: (id, status)  => api.put(`/orders/${id}/status`, { status }),
};

export const userAPI = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAll:        ()     => api.get('/users'),
};

export default api;
