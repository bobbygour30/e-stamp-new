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

// Upload API
export const uploadAPI = {
  uploadStampPaper: (formData) => api.post('/upload/stamp-paper', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Document API
export const documentAPI = {
  createRequest: (data) => api.post('/documents/create', data),
  getUserRequests: () => api.get('/documents/my-requests'),
  getRequest: (id) => api.get(`/documents/${id}`),
  getAdminRequests: (params) => api.get('/documents/admin/all', { params }),
  getAdminStats: () => api.get('/documents/admin/stats'),
  updateStatus: (id, data) => api.put(`/documents/${id}/status`, data),
  updatePDFUrl: (id, data) => api.put(`/documents/${id}/pdf-url`, data),
  makePDFAvailable: (id) => api.post(`/documents/${id}/make-pdf-available`),
  getVendorOrders: () => api.get('/documents/vendor-orders'),
  getOrderByOrderId: (orderId) => api.get(`/documents/order/${orderId}`)
};

// Payment API with PayU
export const paymentAPI = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  getPaymentStatus: (txnId) => api.get(`/payments/status/${txnId}`)
};

// Add this to the authAPI object
export const authAPI = {
  // User operations
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
  
  // Admin - User Management
  getAllUsers: () => api.get('/auth/users'),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  
  // Admin - Vendor Management
  registerVendor: (data) => api.post('/auth/register-vendor', data),
  getAllVendors: () => api.get('/auth/vendors'),
  getVendorById: (id) => api.get(`/auth/vendors/${id}`),
  updateVendor: (id, data) => api.put(`/auth/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/auth/vendors/${id}`),
    // Admin - Employee Management
  registerEmployee: (data) => api.post('/auth/register-employee', data),
  getAllEmployees: () => api.get('/auth/employees'),
  getEmployeeById: (id) => api.get(`/auth/employees/${id}`),
  updateEmployee: (id, data) => api.put(`/auth/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/auth/employees/${id}`),
  
  // Get current user's permissions
  getMyPermissions: () => api.get('/auth/me').then(res => res.data.employeeDetails?.permissions),
  
  // Vendor self-registration
  registerAsVendor: (data) => api.post('/auth/register', { ...data, role: 'vendor' })
};

// Add to your api.js
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};
// Add to your api.js
export const reportsAPI = {
  getAnalytics: (params) => api.get('/reports/analytics', { params }),
  exportData: (params) => api.get('/reports/export', { params }),
};

// Add to your api.js
export const couponAPI = {
  createCoupon: (data) => api.post('/coupons', data),
  getAllCoupons: (params) => api.get('/coupons', { params }),
  getCouponById: (id) => api.get(`/coupons/${id}`),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  toggleStatus: (id) => api.put(`/coupons/${id}/toggle-status`),
  validateCoupon: (data) => api.post('/coupons/validate', data),
};
// Add to your api.js
export const serviceChargeAPI = {
  getAllCharges: () => api.get('/service-charges'),
  updateCharge: (id, data) => api.put(`/service-charges/${id}`, data),
  getChargeByDocumentType: (documentType) => api.get(`/service-charges/document/${documentType}`),
  initializeCharges: () => api.post('/service-charges/init'),
  bulkUpdate: (data) => api.put('/service-charges/bulk-update', data),
};
// Add to your api.js
export const invoiceAPI = {
  getAllInvoices: (params) => api.get('/invoices', { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  updateInvoice: (id, data) => api.put(`/invoices/${id}`, data),
  generateInvoicePDF: (id) => api.post(`/invoices/${id}/generate-pdf`)
};
// Add to your api.js
export const paymentHistoryAPI = {
  getPaymentHistory: (params) => api.get('/payments/history', { params }),
  getPaymentById: (id) => api.get(`/payments/history/${id}`),
  generateReceipt: (id) => api.get(`/payments/history/${id}/receipt`)
};
export default api;