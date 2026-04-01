import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Document API
export const documentAPI = {
  createRequest: (data) => api.post('/documents/create', data),
  getUserRequests: () => api.get('/documents/my-requests'),
  getRequest: (id) => api.get(`/documents/${id}`),
  getAdminRequests: (params) => api.get('/documents/admin/all', { params }),
  getAdminStats: () => api.get('/documents/admin/stats'),
  updateStatus: (id, data) => api.put(`/documents/${id}/status`, data),
  updatePDFUrl: (id, data) => api.put(`/documents/${id}/pdf-url`, data),
  makePDFAvailable: (id) => api.post(`/documents/${id}/make-pdf-available`)  // Add this
};

// Payment API with PayU
export const paymentAPI = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  getPaymentStatus: (txnId) => api.get(`/payments/status/${txnId}`)
};

export default api;