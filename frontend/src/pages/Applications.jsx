import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, FileText, Send } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { applicationService } from '../services/applicationService';
import { useToast } from '../components/ui/Toast';
import { timeAgo, getInitials } from '../utils/helpers';

const statusBadge = (status) => {
  const map = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
  return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>;
};

const ReceivedCard = ({ app, onAccept, onReject }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-5"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#B8A2E3] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {getInitials(app.applicantName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#FAFAFA]">{app.applicantName}</p>
          <p className="text-xs text-[#FAFAFA]/40 mb-1">{app.startupTitle}</p>
          {app.coverLetter && (
            <p className="text-sm text-[#FAFAFA]/50 mt-2 leading-relaxed line-clamp-3">{app.coverLetter}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {statusBadge(app.status)}
        <span className="text-xs text-[#FAFAFA]/30">{timeAgo(app.createdAt)}</span>
      </div>
    </div>
    {app.status === 'PENDING' && (
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => onAccept(app.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#32C864]/15 text-[#32C864] text-sm hover:bg-[#32C864]/25 transition-all"
        >
          <Check className="w-3.5 h-3.5" /> Accept
        </button>
        <button
          onClick={() => onReject(app.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C83232]/15 text-[#C83232] text-sm hover:bg-[#C83232]/25 transition-all"
        >
          <X className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    )}
  </motion.div>
);

const SentCard = ({ app }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-5"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#FAFAFA] mb-0.5">{app.startupTitle}</p>
        <p className="text-xs text-[#FAFAFA]/40">Founded by {app.founderName}</p>
        {app.coverLetter && (
          <p className="text-sm text-[#FAFAFA]/50 mt-2 leading-relaxed line-clamp-2">{app.coverLetter}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        {statusBadge(app.status)}
        <span className="text-xs text-[#FAFAFA]/30">{timeAgo(app.createdAt)}</span>
      </div>
    </div>
  </motion.div>
);

const Applications = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [r, s] = await Promise.all([
          applicationService.getReceived(),
          applicationService.getSent(),
        ]);
        setReceived(r.data);
        setSent(s.data);
      } catch {
        toast('Failed to load applications', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAccept = async (id) => {
    try {
      await applicationService.accept(id);
      setReceived((prev) => prev.map((a) => a.id === id ? { ...a, status: 'APPROVED' } : a));
      toast('Application accepted!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to accept', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await applicationService.reject(id);
      setReceived((prev) => prev.map((a) => a.id === id ? { ...a, status: 'REJECTED' } : a));
      toast('Application rejected', 'info');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to reject', 'error');
    }
  };

  const pendingCount = received.filter((a) => a.status === 'PENDING').length;

  return (
    <AppLayout>
      <div className="pt-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">Applications</h1>
          <p className="text-[#FAFAFA]/40">Manage your startup applications</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === 'received' ? 'text-[#FAFAFA] border-b-2 border-[#8B1E3F]' : 'text-[#FAFAFA]/40 hover:text-[#FAFAFA]/70'}`}
          >
            <FileText className="w-4 h-4" /> Received
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#8B1E3F] text-xs text-white">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === 'sent' ? 'text-[#FAFAFA] border-b-2 border-[#8B1E3F]' : 'text-[#FAFAFA]/40 hover:text-[#FAFAFA]/70'}`}
          >
            <Send className="w-4 h-4" /> Sent
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs">{sent.length}</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading..." />
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'received' ? (
              <motion.div key="received" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                {received.length === 0 ? (
                  <EmptyState icon={FileText} title="No applications received" description="Applications to your startups will appear here" />
                ) : (
                  received.map((app) => <ReceivedCard key={app.id} app={app} onAccept={handleAccept} onReject={handleReject} />)
                )}
              </motion.div>
            ) : (
              <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                {sent.length === 0 ? (
                  <EmptyState icon={Send} title="No applications sent" description="Apply to startups from the dashboard" />
                ) : (
                  sent.map((app) => <SentCard key={app.id} app={app} />)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
};

export default Applications;
