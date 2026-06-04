import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Link2, Plus, X, Save } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    bio: '', skills: [], github: '', linkedin: '', college: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await profileService.getProfile();
        setForm({
          bio: data.bio || '',
          skills: data.skills || [],
          github: data.github || '',
          linkedin: data.linkedin || '',
          college: data.college || '',
        });
      } catch {
        toast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (s) => setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile(form);
      await refreshUser();
      toast('Profile updated!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout><LoadingSpinner text="Loading profile..." /></AppLayout>;

  return (
    <AppLayout>
      <div className="pt-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">Profile</h1>
          <p className="text-[#FAFAFA]/40">Manage your public profile</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar + Name card */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#B8A2E3] flex items-center justify-center text-3xl font-bold text-white mb-4">
              {getInitials(user?.name)}
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA]">{user?.name}</h2>
            <p className="text-sm text-[#FAFAFA]/40 mt-1">{user?.email}</p>
            {form.college && <p className="text-xs text-[#FAFAFA]/30 mt-2">{form.college}</p>}

            {/* Social links */}
            <div className="flex gap-3 mt-4">
              {form.github && (
                <a href={form.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/[0.05] text-[#FAFAFA]/40 hover:text-[#FAFAFA] transition-colors">
                  <GitFork className="w-4 h-4" />
                </a>
              )}
              {form.linkedin && (
                <a href={form.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/[0.05] text-[#B8A2E3] hover:text-[#FAFAFA] transition-colors">
                  <Link2 className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Skills */}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {form.skills.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-full text-xs bg-[#B8A2E3]/10 text-[#B8A2E3]/70">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Edit form */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[#FAFAFA] mb-5">Edit Profile</h3>

            <div className="flex flex-col gap-4">
              {/* Bio */}
              <div>
                <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Bio</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Tell people about yourself..."
                  value={form.bio}
                  onChange={set('bio')}
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">College / Organization</label>
                <input className="input-field" placeholder="e.g. MIT, Google..." value={form.college} onChange={set('college')} />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">GitHub URL</label>
                <div className="relative">
                  <GitFork className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAFAFA]/30" />
                  <input className="input-field pl-10" placeholder="https://github.com/username" value={form.github} onChange={set('github')} />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">LinkedIn URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAFAFA]/30" />
                  <input className="input-field pl-10" placeholder="https://linkedin.com/in/username" value={form.linkedin} onChange={set('linkedin')} />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="input-field flex-1"
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary px-4 py-2 flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8A2E3]/10 text-[#B8A2E3]/80 text-sm border border-[#B8A2E3]/15">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-[#C83232] transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
