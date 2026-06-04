import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
        <Icon className="w-8 h-8 text-[#FAFAFA]/20" />
      </div>
    )}
    <div>
      <h3 className="text-xl font-semibold text-[#FAFAFA]/60 mb-1">{title}</h3>
      {description && <p className="text-sm text-[#FAFAFA]/30 max-w-xs mx-auto">{description}</p>}
    </div>
    {action}
  </motion.div>
);

export default EmptyState;
