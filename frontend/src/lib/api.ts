import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  // Check if we're on the client side before accessing localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getProducts = async () => {
  const response = await api.get('/api/products');
  // Return the response directly since the backend returns the array directly
  return response;
};

export const getProductById = (id: string) => api.get(`/api/products/${id}`);

export default api;
