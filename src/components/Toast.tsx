import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  testId?: string;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; iconColor: string; label: string }
> = {
  success: {
    border: 'border-emerald-400/45',
    iconColor: 'text-emerald-400',
    label: 'Confirmado',
  },
  info: {
    border: 'border-slate-700',
    iconColor: 'text-sky-300',
    label: 'Informação',
  },
  error: {
    border: 'border-rose-500/50',
    iconColor: 'text-rose-400',
    label: 'Atenção',
  },
};

function AnimatedSuccessCheckmark() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      data-testid="toast-success-checkmark"
      className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      {/* Subtle one-shot confirmation halo */}
      {!shouldReduceMotion && (
        <motion.span
          initial={{ scale: 0.7, opacity: 0.55 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="absolute inset-0 rounded-full bg-emerald-400/25"
        />
      )}

      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative h-6 w-6 text-emerald-400"
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.82 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        <motion.circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.35"
          fill="rgba(16, 185, 129, 0.1)"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M8.2 12.4l2.5 2.6 5.2-5.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
    </div>
  );
}

export function Toast({
  isOpen,
  onClose,
  title,
  description,
  variant = 'success',
  durationMs = 5500,
  testId = 'toast-notification',
}: ToastProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen || durationMs <= 0) return;
    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, durationMs, onClose]);

  const { border, iconColor } = VARIANT_STYLES[variant];
  const isAssertive = variant === 'error';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid={testId}
          role={isAssertive ? 'alert' : 'status'}
          aria-live={isAssertive ? 'assertive' : 'polite'}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-md rounded-lg border ${border} bg-[#12141A] px-4 py-3.5 shadow-xl shadow-black/60`}
        >
          <div className="flex items-start gap-3">
            {variant === 'success' ? (
              <AnimatedSuccessCheckmark />
            ) : variant === 'error' ? (
              <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
            ) : (
              <Info className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-50 leading-snug">{title}</p>
              {description && (
                <p className="mt-0.5 text-xs text-slate-300 leading-snug break-words">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar notificação"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
