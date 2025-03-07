import api from './axios';

export const getCategories = () => api.get('/categories').then((r) => r.data.data);
export const getCategory = (slug) => api.get(`/categories/${slug}`).then((r) => r.data.data);
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const getTags = () => api.get('/tags').then((r) => r.data.data);
