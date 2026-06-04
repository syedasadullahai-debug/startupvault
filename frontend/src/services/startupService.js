import api from './api';

export const startupService = {
  getAll: (params) => api.get('/startups', { params }),
  getById: (id) => api.get(`/startups/${id}`),
  create: (data) => api.post('/startups', data),
  update: (id, data) => api.put(`/startups/${id}`, data),
  delete: (id) => api.delete(`/startups/${id}`),
  getMyStartups: () => api.get('/startups/my'),
  like: (id) => api.post(`/likes/startups/${id}`),
  unlike: (id) => api.delete(`/likes/startups/${id}`),
  bookmark: (id) => api.post(`/bookmarks/startups/${id}`),
  unbookmark: (id) => api.delete(`/bookmarks/startups/${id}`),
};
