import api from './api';

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllRead: () => api.post('/notifications/read-all'),
  markRead: (id) => api.post(`/notifications/${id}/read`),
};
