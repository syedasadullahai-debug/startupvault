import api from './api';

export const applicationService = {
  apply: (startupId, data) => api.post(`/applications/startups/${startupId}`, data),
  getReceived: () => api.get('/applications/received'),
  getSent: () => api.get('/applications/sent'),
  accept: (id) => api.post(`/applications/${id}/accept`),
  reject: (id) => api.post(`/applications/${id}/reject`),
};
