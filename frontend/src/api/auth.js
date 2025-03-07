import api from './axios';

export const register = (data) => api.post('/register', data).then((r) => r.data);
export const login = (data) => api.post('/login', data).then((r) => r.data);
export const logout = () => api.post('/logout');
export const getMe = () => api.get('/user').then((r) => r.data.data);
export const updateProfile = (data) => api.put('/user', data).then((r) => r.data.data);
export const getAuthor = (id) => api.get(`/users/${id}`).then((r) => r.data.data);
