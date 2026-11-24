import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { FAQ_ITEMS, toggleFaqId } from '../utils/pipelineLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

export function FaqSection() {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (id: string) => {
    setOpenIds((prev) => toggleFaqId(prev, id));
  };

  return (
    <section id="faq" className="scroll-mt-16 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Intro Column */}
          <RevealSection className="lg:col-span-4">
            <p className="font-mono text-xs font-medium text-sky-400">07. FAQ Técnico &amp; Segurança</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
              Dúvidas frequentes sobre ITIL, Hexagonal e segurança.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
              Respostas diretas para avaliações de arquitetura, compliance e segurança antes de iniciar sua PoC
              corporativa.
            </p>

            <div className="mt-6 rounded-lg border border-slate-800 bg-[#0A0B0E] p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-mono font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Garantia de Governança</span>
              </div>
              <p className="mt-2 leading-relaxed text-slate-400">
                <GlossaryText text="Nenhum PR entra em produção sem testes verdes em sandbox, auditoria DRY e aprovação explícita do time humano." />
              </p>
            </div>
          </RevealSection>

          {/* Right Accordion Column */}
          <RevealSection delay={0.08} className="lg:col-span-8">
            <div data-testid="faq-accordion" className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#0A0B0E] overflow-hidden">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openIds.includes(item.id);
                const buttonId = `faq-trigger-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <div key={item.id} className={isOpen ? 'bg-[#12141A]/55 transition-colors' : 'transition-colors'}>
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => handleToggle(item.id)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left cursor-pointer hover:bg-[#12141A]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
                      >
                        <div className="min-w-0">
                          <span className="block font-mono text-[11px] font-medium text-sky-400">
                            {item.category}
                          </span>
                          <span className="mt-1 block text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                            {item.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-sky-400' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0.5 text-sm leading-relaxed text-slate-300">
                            <p>
                              <GlossaryText text={item.answer} />
                            </p>
                            <div className="mt-3 rounded-md border border-slate-800 bg-[#040507] px-3.5 py-2.5 font-mono text-xs text-emerald-400">
                              <GlossaryText text={item.guardrailNote} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
