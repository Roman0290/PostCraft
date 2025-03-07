import api from './axios';

/** params: { page, search, category, tag, author, per_page } */
export const getPosts = (params = {}) => api.get('/posts', { params }).then((r) => r.data);
export const getPost = (slug) => api.get(`/posts/${slug}`).then((r) => r.data.data);
export const getMyPosts = (page = 1) => api.get('/me/posts', { params: { page } }).then((r) => r.data);

function toFormData(values) {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'boolean') value = value ? '1' : '0';
    form.append(key, value);
  });
  return form;
}

export const createPost = (values) => api.post('/posts', toFormData(values)).then((r) => r.data.data);

// PHP can't read multipart bodies on PUT, so we POST and spoof the method.
export const updatePost = (id, values) =>
  api.post(`/posts/${id}`, toFormData({ ...values, _method: 'PUT' })).then((r) => r.data.data);

export const deletePost = (id) => api.delete(`/posts/${id}`);
