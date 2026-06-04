import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await notificationService.getUnreadCount();
      setUnreadCount(data.count ?? data ?? 0);
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchUnread]);

  return { unreadCount, setUnreadCount, refetch: fetchUnread };
};
