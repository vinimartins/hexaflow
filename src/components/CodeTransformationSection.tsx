import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileCode2, ShieldAlert } from 'lucide-react';
import {
  CODE_TRANSFORMATIONS,
  CodeTransformationTier,
  getCodeTransformationByTier,
} from '../utils/pipelineLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

export function CodeTransformationSection() {
  const [selectedTier, setSelectedTier] = useState<CodeTransformationTier>('N1');
  const shouldReduceMotion = useReducedMotion();
  const active = getCodeTransformationByTier(selectedTier);

  return (
    <section
      id="transformacao-codigo"
      className="scroll-mt-16 border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-sky-400">
              Simulação de Refatoração · Clean Code &amp; Arquitetura Hexagonal
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Veja como o código evolui entre N1, N2 e N3 — sem vazar infraestrutura no domínio.
            </h2>
          </div>

          {/* N1 - N2 - N3 Interactive Stage Selector */}
          <div
            role="tablist"
            aria-label="Estágios N1 a N3 de transformação de código"
            className="grid grid-cols-3 gap-1.5 rounded-lg border border-slate-800 bg-[#0A0B0E] p-1.5 shrink-0"
          >
            {CODE_TRANSFORMATIONS.map((item) => {
              const isSelected = item.tier === selectedTier;
              return (
                <button
                  key={item.tier}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-testid={`transform-tab-${item.tier}`}
                  onClick={() => setSelectedTier(item.tier)}
                  className={`rounded-md px-3 py-2 font-mono text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isSelected
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-300 hover:bg-[#12141A] hover:text-white'
                  }`}
                >
                  {item.tabLabel}
                </button>
              );
            })}
          </div>
        </RevealSection>

        {/* Active Transformation Comparison */}
        <RevealSection delay={0.08} className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.tier}
              data-testid="code-transformation-panel"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl border border-slate-800 bg-[#0A0B0E] p-5 sm:p-6"
            >
              {/* Stage Header & Summary */}
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 font-mono text-xs">
                    <span className="font-semibold text-sky-400">Estágio {active.tier}</span>
                    <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
                    <span className="text-slate-200">{active.stageTitle}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                    <GlossaryText text={active.summary} />
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <GlossaryText text={active.afterPattern} />
                  </span>
                </div>
              </div>

              {/* Before vs After Code Panels */}
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* ANTES */}
                <div
                  data-testid="code-before-panel"
                  data-code-surface="dark"
                  className="flex flex-col rounded-lg border border-rose-500/30 bg-[#040507] overflow-hidden min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-rose-500/[0.06] px-4 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-xs font-semibold text-rose-300">Antes</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="font-mono text-xs text-slate-300 truncate">{active.beforeFile}</span>
                    </div>
                    <span className="font-mono text-[11px] text-rose-300/90">{active.beforeIssue}</span>
                  </div>

                  <pre className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-6 text-slate-300">
                    <code>
                      {active.beforeCode.map((line, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="w-5 select-none text-right text-slate-600 tabular-nums shrink-0">
                            {index + 1}
                          </span>
                          <span className="whitespace-pre text-rose-200/90">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* DEPOIS */}
                <div
                  data-testid="code-after-panel"
                  data-code-surface="dark"
                  className="flex flex-col rounded-lg border border-emerald-400/35 bg-[#040507] overflow-hidden min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-emerald-400/[0.07] px-4 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-xs font-semibold text-emerald-300">Depois</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="font-mono text-xs text-slate-200 truncate">{active.afterFile}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-300">Hexagonal + Clean Code</span>
                  </div>

                  <pre className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-6 text-slate-200">
                    <code>
                      {active.afterCode.map((line, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="w-5 select-none text-right text-slate-600 tabular-nums shrink-0">
                            {index + 1}
                          </span>
                          <span className="whitespace-pre text-emerald-200/95">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Principles Footer */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-slate-300">
                  {active.principles.map((principle) => (
                    <span key={principle} className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" aria-hidden="true" />
                      <span>
                        <GlossaryText text={principle} />
                      </span>
                    </span>
                  ))}
                </div>

                <a
                  href="#diagnostico"
                  className="inline-flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Validar no seu repositório</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </RevealSection>
      </div>
    </section>
  );
}
