import { ArrowRight, Check } from 'lucide-react';
import { PLAN_OPTIONS, PlanOption } from '../utils/pipelineLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

interface PricingSectionProps {
  selectedPlanId: PlanOption['id'];
  onSelectPlan: (planId: PlanOption['id']) => void;
}

export function PricingSection({ selectedPlanId, onSelectPlan }: PricingSectionProps) {
  return (
    <section id="planos" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-sky-400">05. Modelos de Contratação B2B</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
            Comece com uma PoC Corporativa de 2 semanas ou implante a esteira completa.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Formatos executivos estruturados para comprovar ROI operacional em tickets reais antes de expandir a célula
            autônoma para múltiplos squads.
          </p>
        </RevealSection>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLAN_OPTIONS.map((plan, index) => {
            const isHighlighted = Boolean(plan.highlighted);
            const isActiveSelection = selectedPlanId === plan.id;

            return (
              <RevealSection key={plan.id} delay={index * 0.07} className="h-full">
                <article
                  className={`flex h-full flex-col justify-between rounded-xl border p-6 sm:p-7 transition-colors ${
                    isHighlighted
                      ? 'border-sky-400/50 bg-[#12141A]'
                      : 'border-slate-800 bg-[#0A0B0E]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-300">{plan.cadence}</span>
                      {isHighlighted && (
                        <span className="font-mono font-semibold text-emerald-400">Recomendado</span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-slate-50">{plan.name}</h3>
                    <p className="mt-1 text-xs font-medium text-sky-300">{plan.audience}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      <GlossaryText text={plan.summary} />
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-slate-800 pt-5 text-sm text-slate-200">
                      {plan.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                          <span className="leading-snug">
                            <GlossaryText text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        isHighlighted
                          ? 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                          : isActiveSelection
                          ? 'border border-sky-400 bg-sky-400/15 text-sky-200 hover:bg-sky-400/25'
                          : 'border border-slate-700 bg-[#040507] text-slate-100 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
