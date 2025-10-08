import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  console.log('API request being made:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    // Don't log sensitive data like request body that might contain passwords
  });
  
  // Check if we're on the client side before accessing localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Adding authorization token to request');
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  console.error('API request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API request failed:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const getProducts = async () => {
  const response = await api.get('/products');
  // Return the response directly since the backend returns the array directly
  return response;
};

export const getProductById = (id: string) => api.get(`/products/${id}`);

export default api;
