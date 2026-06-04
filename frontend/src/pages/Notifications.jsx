import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Check } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { notificationService } from '../services/notificationService';
import { useToast } from '../components/ui/Toast';
import { timeAgo } from '../utils/helpers';

const notifIcon = (type) => {
  const colors = {
    APPLICATION_RECEIVED: 'from-[#B8A2E3] to-[#8B1E3F]',
    APPLICATION_ACCEPTED: 'from-[#32C864] to-[#20A855]',
    APPLICATION_REJECTED: 'from-[#C83232] to-[#A02020]',
    STARTUP_LIKED: 'from-[#8B1E3F] to-[#C8A032]',
  };
  return colors[type] || 'from-[#8B1E3F] to-[#B8A2E3]';
};

const Notifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await notificationService.getAll();
        setNotifications(data);
      } catch {
        toast('Failed to load notifications', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast('All marked as read', 'success');
    } catch {
      toast('Failed', 'error');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="pt-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">Notifications</h1>
            <p className="text-[#FAFAFA]/40">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="btn-ghost flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
        </motion.div>

        {loading ? (
          <LoadingSpinner text="Loading..." />
        ) : notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="No notifications yet" description="Activity from your startups will appear here" />
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`glass rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-white/[0.12] ${!n.read ? 'border border-[#8B1E3F]/20 bg-[#8B1E3F]/[0.03]' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${notifIcon(n.type)} flex items-center justify-center flex-shrink-0`}>
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'text-[#FAFAFA]/60' : 'text-[#FAFAFA]'}`}>{n.message}</p>
                  <p className="text-xs text-[#FAFAFA]/30 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#8B1E3F] flex-shrink-0 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
