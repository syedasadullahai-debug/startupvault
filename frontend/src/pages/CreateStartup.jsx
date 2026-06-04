import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Rocket } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { startupService } from '../services/startupService';
import { useToast } from '../components/ui/Toast';
import { CATEGORIES } from '../utils/constants';

const CreateStartup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '', problem: '', solution: '', category: '', requiredSkills: [],
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.requiredSkills.includes(s)) {
      setForm((p) => ({ ...p, requiredSkills: [...p.requiredSkills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setForm((p) => ({ ...p, requiredSkills: p.requiredSkills.filter((x) => x !== s) }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.problem.trim()) e.problem = 'Problem statement is required';
    if (!form.solution.trim()) e.solution = 'Solution is required';
    if (!form.category) e.category = 'Category is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await startupService.create(form);
      toast('Startup created!', 'success');
      navigate(`/startups/${data.id}`);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create startup', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="pt-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">Create Startup</h1>
          <p className="text-[#FAFAFA]/40">Share your vision with the world</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Startup Name *</label>
              <input className="input-field" placeholder="e.g. AI Attendance System" value={form.title} onChange={set('title')} />
              {errors.title && <p className="text-xs text-[#C83232] mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Category *</label>
              <select className="input-field cursor-pointer" value={form.category} onChange={set('category')}>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-[#C83232] mt-1">{errors.category}</p>}
            </div>

            {/* Problem */}
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Problem Statement *</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="What problem does your startup solve?"
                value={form.problem}
                onChange={set('problem')}
              />
              {errors.problem && <p className="text-xs text-[#C83232] mt-1">{errors.problem}</p>}
            </div>

            {/* Solution */}
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Solution *</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="How does your startup solve it?"
                value={form.solution}
                onChange={set('solution')}
              />
              {errors.solution && <p className="text-xs text-[#C83232] mt-1">{errors.solution}</p>}
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input-field flex-1"
                  placeholder="e.g. React, Python, ML..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="btn-secondary px-4 py-2 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {form.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.requiredSkills.map((s) => (
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
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Rocket className="w-4 h-4" /> Launch Startup</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CreateStartup;
