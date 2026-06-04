import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import StartupCard from '../components/ui/StartupCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { startupService } from '../services/startupService';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import { CATEGORIES } from '../utils/constants';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_liked', label: 'Most Liked' },
];

const Dashboard = () => {
  const toast = useToast();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const debouncedSearch = useDebounce(search);

  const fetchStartups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await startupService.getAll({
        search: debouncedSearch || undefined,
        category: category || undefined,
        sort,
        page,
        size: 9,
      });
      setStartups(data.content || data);
      setTotalPages(data.totalPages || 1);
      // Track liked/bookmarked
      const liked = new Set();
      const bookmarked = new Set();
      (data.content || data).forEach((s) => {
        if (s.likedByCurrentUser) liked.add(s.id);
        if (s.bookmarkedByCurrentUser) bookmarked.add(s.id);
      });
      setLikedIds(liked);
      setBookmarkedIds(bookmarked);
    } catch {
      toast('Failed to load startups', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort, page]);

  useEffect(() => { setPage(0); }, [debouncedSearch, category, sort]);
  useEffect(() => { fetchStartups(); }, [fetchStartups]);

  const handleLike = async (id) => {
    try {
      if (likedIds.has(id)) {
        await startupService.unlike(id);
        setLikedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        setStartups((prev) => prev.map((s) => s.id === id ? { ...s, likeCount: s.likeCount - 1 } : s));
      } else {
        await startupService.like(id);
        setLikedIds((prev) => new Set([...prev, id]));
        setStartups((prev) => prev.map((s) => s.id === id ? { ...s, likeCount: s.likeCount + 1 } : s));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleBookmark = async (id) => {
    try {
      if (bookmarkedIds.has(id)) {
        await startupService.unbookmark(id);
        setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      } else {
        await startupService.bookmark(id);
        setBookmarkedIds((prev) => new Set([...prev, id]));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <AppLayout>
      <div className="pt-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">Discover Startups</h1>
          <p className="text-[#FAFAFA]/40 text-lg">Find your next venture</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAFAFA]/30" />
              <input
                className="input-field pl-10"
                placeholder="Search startups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field md:w-44 cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field md:w-40 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${!category ? 'bg-[#8B1E3F] text-white' : 'bg-white/[0.05] text-[#FAFAFA]/40 hover:bg-white/[0.08]'}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? '' : c)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${category === c ? 'bg-[#8B1E3F] text-white' : 'bg-white/[0.05] text-[#FAFAFA]/40 hover:bg-white/[0.08]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading startups..." />
        ) : startups.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No startups found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {startups.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <StartupCard
                    startup={s}
                    liked={likedIds.has(s.id)}
                    bookmarked={bookmarkedIds.has(s.id)}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn-ghost py-2 px-3 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-[#FAFAFA]/40">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn-ghost py-2 px-3 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
