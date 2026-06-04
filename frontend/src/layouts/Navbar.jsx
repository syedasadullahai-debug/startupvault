import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, Rocket, LogOut, User, LayoutDashboard, Plus, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { getInitials } from '../utils/helpers';

const navLinks = [
  { to: '/dashboard', label: 'Discover', icon: LayoutDashboard },
  { to: '/my-startups', label: 'My Startups', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/create-startup', label: 'Create', icon: Plus },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark border-b border-white/[0.06] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B1E3F] to-[#6B1530] flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#FAFAFA] tracking-tight">
              StartupVault
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-[#8B1E3F]/20 text-[#FAFAFA]'
                      : 'text-[#FAFAFA]/50 hover:text-[#FAFAFA]/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-[#FAFAFA]/50 hover:text-[#FAFAFA] hover:bg-white/[0.05] transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B1E3F] rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#B8A2E3] flex items-center justify-center text-sm font-semibold text-white">
                      {getInitials(user.name)}
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 glass-dark rounded-xl overflow-hidden shadow-xl border border-white/[0.08]"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-[#FAFAFA]">{user.name}</p>
                          <p className="text-xs text-[#FAFAFA]/40 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-white/[0.04] transition-all"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FAFAFA]/70 hover:text-[#C83232] hover:bg-white/[0.04] transition-all"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded-lg text-[#FAFAFA]/50 hover:text-[#FAFAFA]"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && user && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 pb-2 border-t border-white/[0.06] pt-3 flex flex-col gap-1"
            >
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive(to)
                      ? 'bg-[#8B1E3F]/20 text-[#FAFAFA]'
                      : 'text-[#FAFAFA]/50 hover:text-[#FAFAFA]'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
