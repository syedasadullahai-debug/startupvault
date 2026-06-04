import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Users, Tag, Calendar, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { startupService } from '../services/startupService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { formatDate, getInitials } from '../utils/helpers';

const StartupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const { data } = await startupService.getById(id);
        setStartup(data);
        setLiked(data.likedByCurrentUser || false);
        setBookmarked(data.bookmarkedByCurrentUser || false);
      } catch {
        toast('Startup not found', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await startupService.unlike(id);
        setStartup((p) => ({ ...p, likeCount: p.likeCount - 1 }));
      } else {
        await startupService.like(id);
        setStartup((p) => ({ ...p, likeCount: p.likeCount + 1 }));
      }
      setLiked(!liked);
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await startupService.unbookmark(id);
        toast('Removed from bookmarks', 'info');
      } else {
        await startupService.bookmark(id);
        toast('Bookmarked!', 'success');
      }
      setBookmarked(!bookmarked);
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.apply(id, { coverLetter });
      toast('Application submitted!', 'success');
      setShowApplyForm(false);
      const { data } = await startupService.getById(id);
      setStartup(data);
    } catch (err) {
      toast(err.response?.data?.message || 'Application failed', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <AppLayout><LoadingSpinner text="Loading startup..." /></AppLayout>;
  if (!startup) return null;

  const isFounder = user?.id === startup.founderId;
  const hasApplied = startup.applicationStatus != null;
  const isMember = startup.isMember;

  return (
    <AppLayout>
      <div className="pt-6 max-w-4xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#FAFAFA]/40 hover:text-[#FAFAFA] transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-pending">{startup.category}</span>
                    {isFounder && <span className="badge" style={{ background: 'rgba(139,30,63,0.15)', color: '#8B1E3F', border: '1px solid rgba(139,30,63,0.25)' }}>Founder</span>}
                    {isMember && !isFounder && <span className="badge badge-approved">Member</span>}
                  </div>
                  <h1 className="text-3xl font-bold text-[#FAFAFA]">{startup.title}</h1>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={handleLike} className={`p-2 rounded-xl transition-all ${liked ? 'bg-[#8B1E3F]/20 text-[#8B1E3F]' : 'bg-white/[0.05] text-[#FAFAFA]/40 hover:text-[#8B1E3F]'}`}>
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleBookmark} className={`p-2 rounded-xl transition-all ${bookmarked ? 'bg-[#B8A2E3]/20 text-[#B8A2E3]' : 'bg-white/[0.05] text-[#FAFAFA]/40 hover:text-[#B8A2E3]'}`}>
                    <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Problem */}
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#FAFAFA] mb-2">The Problem</h2>
                <p className="text-[#FAFAFA]/60 leading-relaxed">{startup.problem}</p>
              </div>

              {/* Solution */}
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#FAFAFA] mb-2">Our Solution</h2>
                <p className="text-[#FAFAFA]/60 leading-relaxed">{startup.solution}</p>
              </div>

              {/* Skills */}
              {startup.requiredSkills?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#FAFAFA] mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {startup.requiredSkills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-sm bg-[#B8A2E3]/10 text-[#B8A2E3]/70 border border-[#B8A2E3]/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Apply section */}
            {!isFounder && !isMember && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-[#FAFAFA] mb-4">Join This Startup</h2>
                {hasApplied ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04]">
                    <CheckCircle className="w-5 h-5 text-[#32C864]" />
                    <div>
                      <p className="text-sm text-[#FAFAFA]/70">Application submitted</p>
                      <p className="text-xs text-[#FAFAFA]/40 mt-0.5">Status: <span className={`font-medium ${startup.applicationStatus === 'APPROVED' ? 'text-[#32C864]' : startup.applicationStatus === 'REJECTED' ? 'text-[#C83232]' : 'text-[#C8A032]'}`}>{startup.applicationStatus}</span></p>
                    </div>
                  </div>
                ) : showApplyForm ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Tell the founder why you'd be a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleApply} disabled={applying} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        {applying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit</>}
                      </button>
                      <button onClick={() => setShowApplyForm(false)} className="btn-ghost">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowApplyForm(true)} className="btn-primary flex items-center gap-2">
                    <Send className="w-4 h-4" /> Apply to Join
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-5">
              <h3 className="text-sm text-[#FAFAFA]/40 uppercase tracking-wider mb-4">Stats</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#FAFAFA]/50">
                    <Heart className="w-4 h-4" /> Likes
                  </div>
                  <span className="text-[#FAFAFA] font-semibold">{startup.likeCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#FAFAFA]/50">
                    <Users className="w-4 h-4" /> Members
                  </div>
                  <span className="text-[#FAFAFA] font-semibold">{startup.memberCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#FAFAFA]/50">
                    <Calendar className="w-4 h-4" /> Created
                  </div>
                  <span className="text-[#FAFAFA] text-sm">{formatDate(startup.createdAt)}</span>
                </div>
              </div>
            </motion.div>

            {/* Founder */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5">
              <h3 className="text-sm text-[#FAFAFA]/40 uppercase tracking-wider mb-4">Founder</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#B8A2E3] flex items-center justify-center text-sm font-bold text-white">
                  {getInitials(startup.founderName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#FAFAFA]">{startup.founderName}</p>
                </div>
              </div>
            </motion.div>

            {/* Members */}
            {startup.members?.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-5">
                <h3 className="text-sm text-[#FAFAFA]/40 uppercase tracking-wider mb-4">Team</h3>
                <div className="flex flex-col gap-3">
                  {startup.members.map((m) => (
                    <div key={m.userId} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8A2E3]/40 to-[#8B1E3F]/40 flex items-center justify-center text-xs font-bold text-[#B8A2E3]">
                        {getInitials(m.userName)}
                      </div>
                      <span className="text-sm text-[#FAFAFA]/70">{m.userName}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StartupDetails;
