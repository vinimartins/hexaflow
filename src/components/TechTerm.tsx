import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import {
  computeTooltipPosition,
  GlossaryTermKey,
  TECHNICAL_GLOSSARY,
  tokenizeGlossaryText,
} from '../utils/pipelineLogic';

interface TriggerRect {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

interface ActiveGlossaryState {
  key: GlossaryTermKey;
  rect: TriggerRect;
  pinned: boolean;
}

interface GlossaryContextValue {
  activeState: ActiveGlossaryState | null;
  openHover: (key: GlossaryTermKey, rect: TriggerRect) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  togglePin: (key: GlossaryTermKey, rect: TriggerRect) => void;
  closeAll: () => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

const DESKTOP_TOOLTIP_SIZE = { width: 320, height: 185 };

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [activeState, setActiveState] = useState<ActiveGlossaryState | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeAll = useCallback(() => {
    cancelClose();
    setActiveState(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveState((prev) => (prev && !prev.pinned ? null : prev));
    }, 130);
  }, [cancelClose]);

  const openHover = useCallback(
    (key: GlossaryTermKey, rect: TriggerRect) => {
      if (isMobileViewport) return;
      cancelClose();
      setActiveState((prev) => {
        if (prev?.pinned && prev.key !== key) return prev;
        return { key, rect, pinned: prev?.key === key ? prev.pinned : false };
      });
    },
    [cancelClose, isMobileViewport]
  );

  const togglePin = useCallback(
    (key: GlossaryTermKey, rect: TriggerRect) => {
      cancelClose();
      setActiveState((prev) => {
        if (prev && prev.key === key && prev.pinned) {
          return null;
        }
        return { key, rect, pinned: true };
      });
    },
    [cancelClose]
  );

  useEffect(() => {
    if (!activeState) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAll();
      }
    };
    const handleScroll = () => {
      if (!activeState.pinned && !isMobileViewport) {
        closeAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeState, closeAll, isMobileViewport]);

  const entry = activeState ? TECHNICAL_GLOSSARY[activeState.key] : null;
  const desktopPosition =
    activeState && !isMobileViewport && typeof window !== 'undefined'
      ? computeTooltipPosition(
          activeState.rect,
          { width: window.innerWidth, height: window.innerHeight },
          DESKTOP_TOOLTIP_SIZE
        )
      : null;

  return (
    <GlossaryContext.Provider
      value={{
        activeState,
        openHover,
        scheduleClose,
        cancelClose,
        togglePin,
        closeAll,
      }}
    >
      {children}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeState && entry && (
              isMobileViewport ? (
                /* Mobile Touch-Friendly Bottom Sheet Explanation */
                <div
                  key="glossary-mobile-sheet"
                  className="fixed inset-0 z-50 flex items-end justify-center md:hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    onClick={closeAll}
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                  />

                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Explicação técnica: ${entry.term}`}
                    data-testid="glossary-mobile-sheet"
                    initial={shouldReduceMotion ? { opacity: 1 } : { y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full rounded-t-2xl border-t border-sky-400/45 bg-[#12141A] p-5 pb-7 shadow-2xl shadow-black/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-sky-400">
                          <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{entry.category}</span>
                        </div>
                        <h3 className="mt-1 text-base font-semibold text-slate-50">{entry.term}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={closeAll}
                        aria-label="Fechar explicação"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-[#0A0B0E] text-slate-300 hover:text-white cursor-pointer"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-200">{entry.summary}</p>

                    <div className="mt-3.5 rounded-lg border border-slate-800 bg-[#040507] px-3.5 py-2.5 font-mono text-xs text-emerald-400 leading-relaxed">
                      No HexaFlow: {entry.impact}
                    </div>
                  </motion.div>
                </div>
              ) : desktopPosition ? (
                /* Desktop Floating Popover Clamped Inside Viewport */
                <motion.div
                  key={`glossary-popover-${entry.key}`}
                  role="tooltip"
                  data-testid="glossary-desktop-popover"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: desktopPosition.placement === 'bottom' ? -4 : 4 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'fixed',
                    top: desktopPosition.top,
                    left: desktopPosition.left,
                    width: DESKTOP_TOOLTIP_SIZE.width,
                  }}
                  className="z-50 hidden md:block rounded-xl border border-sky-400/45 bg-[#12141A] p-4 shadow-2xl shadow-black/75"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium text-sky-400">
                        <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span>{entry.category}</span>
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-slate-50">{entry.term}</div>
                    </div>
                    {activeState.pinned && (
                      <button
                        type="button"
                        onClick={closeAll}
                        aria-label="Fechar explicação"
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-200">{entry.summary}</p>
                  <p className="mt-2 border-t border-slate-700/70 pt-2 font-mono text-[11px] leading-snug text-emerald-400">
                    {entry.impact}
                  </p>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>,
          document.body
        )}
    </GlossaryContext.Provider>
  );
}

interface TechTermProps {
  termKey: GlossaryTermKey;
  children?: ReactNode;
}

export function TechTerm({ termKey, children }: TechTermProps) {
  const ctx = useContext(GlossaryContext);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const entry = TECHNICAL_GLOSSARY[termKey];

  if (!ctx || !entry) {
    return <>{children ?? entry?.term}</>;
  }

  const isActive = ctx.activeState?.key === termKey;

  const getRect = (): TriggerRect => {
    const el = buttonRef.current;
    if (!el) return { top: 0, bottom: 0, left: 0, width: 0 };
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, width: r.width };
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-tech-term={termKey}
      aria-expanded={isActive}
      onMouseEnter={() => ctx.openHover(termKey, getRect())}
      onMouseLeave={ctx.scheduleClose}
      onFocus={() => ctx.openHover(termKey, getRect())}
      onBlur={ctx.scheduleClose}
      onClick={(e) => {
        e.stopPropagation();
        ctx.togglePin(termKey, getRect());
      }}
      className={`inline border-b border-dotted transition-colors duration-150 cursor-help rounded-[2px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
        isActive
          ? 'border-sky-300 bg-sky-400/10 text-sky-200'
          : 'border-sky-400/70 text-sky-200 hover:border-sky-300 hover:text-sky-100'
      }`}
    >
      {children ?? entry.term}
    </button>
  );
}

export function GlossaryText({ text }: { text: string }) {
  const tokens = tokenizeGlossaryText(text);
  return (
    <>
      {tokens.map((token, idx) =>
        token.type === 'term' ? (
          <TechTerm key={`${token.key}-${idx}`} termKey={token.key}>
            {token.value}
          </TechTerm>
        ) : (
          <span key={idx}>{token.value}</span>
        )
      )}
    </>
  );
}
