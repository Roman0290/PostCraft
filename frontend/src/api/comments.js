import api from './axios';

export const getComments = (slug) => api.get(`/posts/${slug}/comments`).then((r) => r.data.data);
export const addComment = (slug, body) => api.post(`/posts/${slug}/comments`, { body }).then((r) => r.data.data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
