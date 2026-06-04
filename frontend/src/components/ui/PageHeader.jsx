import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start justify-between gap-4 mb-8"
  >
    <div>
      <h1 className="text-4xl font-bold text-[#FAFAFA] mb-1">{title}</h1>
      {subtitle && <p className="text-[#FAFAFA]/40 text-lg">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </motion.div>
);

export default PageHeader;
