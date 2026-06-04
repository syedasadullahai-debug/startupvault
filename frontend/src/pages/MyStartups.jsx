import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Rocket, Users } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import StartupCard from '../components/ui/StartupCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { startupService } from '../services/startupService';
import { useToast } from '../components/ui/Toast';

const MyStartups = () => {
  const toast = useToast();
  const [data, setData] = useState({ founded: [], joined: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('founded');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await startupService.getMyStartups();
        setData(res);
      } catch {
        toast('Failed to load startups', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const active = data[activeTab] || [];

  return (
    <AppLayout>
      <div className="pt-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">My Startups</h1>
            <p className="text-[#FAFAFA]/40">Manage your ventures</p>
          </div>
          <Link to="/create-startup" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Startup
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab('founded')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === 'founded' ? 'text-[#FAFAFA] border-b-2 border-[#8B1E3F]' : 'text-[#FAFAFA]/40 hover:text-[#FAFAFA]/70'}`}
          >
            <Rocket className="w-4 h-4" />
            Founded
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs">{data.founded?.length || 0}</span>
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === 'joined' ? 'text-[#FAFAFA] border-b-2 border-[#8B1E3F]' : 'text-[#FAFAFA]/40 hover:text-[#FAFAFA]/70'}`}
          >
            <Users className="w-4 h-4" />
            Joined
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs">{data.joined?.length || 0}</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading..." />
        ) : active.length === 0 ? (
          <EmptyState
            icon={activeTab === 'founded' ? Rocket : Users}
            title={activeTab === 'founded' ? 'No startups yet' : 'Not a member anywhere yet'}
            description={activeTab === 'founded' ? 'Create your first startup idea' : 'Apply to join exciting startups on the dashboard'}
            action={activeTab === 'founded' && (
              <Link to="/create-startup" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Startup
              </Link>
            )}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {active.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StartupCard startup={s} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyStartups;
