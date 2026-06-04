import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      await login(form);
      toast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4">
      <div className="grain" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#8B1E3F]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#B8A2E3]/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B1E3F] to-[#6B1530] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#FAFAFA]">StartupVault</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#FAFAFA] mb-2">Welcome Back</h1>
            <p className="text-[#FAFAFA]/40">Sign in to continue building</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>

            <div>
              <label className="block text-sm text-[#FAFAFA]/60 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Your password"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAFAFA]/30 hover:text-[#FAFAFA]/60"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#FAFAFA]/40 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#B8A2E3] hover:text-[#FAFAFA] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
