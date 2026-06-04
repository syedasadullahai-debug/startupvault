import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Heart, Bookmark, Tag, ArrowRight } from 'lucide-react';
import { truncate, getInitials } from '../../utils/helpers';

const StartupCard = ({ startup, onLike, onBookmark, liked, bookmarked }) => {
  const {
    id, title, problem, category, founderName,
    memberCount = 0, likeCount = 0, requiredSkills = [],
  } = startup;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 flex flex-col gap-4 group cursor-pointer h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-pending text-xs">{category}</span>
          </div>
          <Link to={`/startups/${id}`}>
            <h3 className="text-xl font-semibold text-[#FAFAFA] leading-tight group-hover:text-[#B8A2E3] transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E3F]/40 to-[#B8A2E3]/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#B8A2E3]">
          {getInitials(title)}
        </div>
      </div>

      {/* Problem */}
      <p className="text-[#FAFAFA]/50 text-sm leading-relaxed flex-1">
        {truncate(problem, 110)}
      </p>

      {/* Skills */}
      {requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {requiredSkills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full text-xs bg-[#B8A2E3]/10 text-[#B8A2E3]/70 border border-[#B8A2E3]/10">
              {skill}
            </span>
          ))}
          {requiredSkills.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/[0.04] text-[#FAFAFA]/30">
              +{requiredSkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#B8A2E3] flex items-center justify-center text-[10px] font-bold text-white">
            {getInitials(founderName)}
          </div>
          <span className="text-xs text-[#FAFAFA]/40">{founderName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.preventDefault(); onLike?.(id); }}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-[#8B1E3F]' : 'text-[#FAFAFA]/30 hover:text-[#8B1E3F]'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onBookmark?.(id); }}
            className={`flex items-center gap-1 text-xs transition-colors ${bookmarked ? 'text-[#B8A2E3]' : 'text-[#FAFAFA]/30 hover:text-[#B8A2E3]'}`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          <div className="flex items-center gap-1 text-xs text-[#FAFAFA]/30">
            <Users className="w-3.5 h-3.5" />
            {memberCount}
          </div>
          <Link to={`/startups/${id}`} className="text-[#FAFAFA]/30 hover:text-[#B8A2E3] transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StartupCard;
