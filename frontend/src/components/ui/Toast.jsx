import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle className="w-5 h-5 text-[#32C864]" />,
  error: <XCircle className="w-5 h-5 text-[#C83232]" />,
  info: <Info className="w-5 h-5 text-[#B8A2E3]" />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="glass-dark flex items-start gap-3 px-4 py-3.5 shadow-2xl"
            >
              {icons[type]}
              <p className="text-sm text-[#FAFAFA]/80 flex-1">{message}</p>
              <button onClick={() => remove(id)} className="text-[#FAFAFA]/30 hover:text-[#FAFAFA] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
};
