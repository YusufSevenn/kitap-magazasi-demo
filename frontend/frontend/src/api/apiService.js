import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // NestJS portumuz
});

export const getBooks = () => api.get('/books');
export const purchaseBook = (id) => api.post(`/books/purchase/${id}`);
export const resetDatabase = () => api.post('/books/reset');
export const createBook = (data) => api.post('/books', data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const updateBook = (id, data) => api.patch(`/books/${id}`, data);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/register', userData);

export default api;