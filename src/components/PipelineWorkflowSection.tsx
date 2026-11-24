import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ITIL_STAGES } from '../utils/pipelineLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

export function PipelineWorkflowSection() {
  const [activeIndex, setActiveIndex] = useState<number>(3); // Highlight Solution PR / Human-in-the-Loop or interactive selection
  const activeStage = ITIL_STAGES[activeIndex];

  return (
    <section id="esteira" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-sky-400">02. Esteira ITIL Corporativa (5 Estágios)</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
              Da fila de chamados N1 ao Pull Request auditável — com memória arquitetural contínua.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-slate-400">
            <GlossaryText text="Inspecione cada estágio do pipeline: triagem e SLA, RCA com Blast Radius/DRY, sandbox N3, PR humano e Feedback Loop." />
          </p>
        </RevealSection>

        {/* 5-Stage ITIL Interactive Selector + Detail View */}
        <RevealSection delay={0.08} className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: 5 Stages List */}
          <div className="space-y-2.5 lg:col-span-6" role="tablist" aria-label="Estágios da esteira ITIL HexaFlow">
            {ITIL_STAGES.map((stage, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={stage.number}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full rounded-lg border px-4 py-3.5 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isSelected
                      ? 'border-sky-400/60 bg-[#12141A]'
                      : 'border-slate-800 bg-[#0A0B0E] hover:border-slate-700 hover:bg-[#12141A]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-semibold text-sky-400 tabular-nums shrink-0">
                        {stage.number}.
                      </span>
                      <span className="text-sm font-semibold text-slate-100 truncate">{stage.title}</span>
                    </div>
                    <span
                      className={`font-mono text-xs font-semibold shrink-0 ${
                        stage.tier === 'PR'
                          ? 'text-amber-300'
                          : stage.tier === 'N3' || stage.tier === 'LOOP'
                          ? 'text-emerald-400'
                          : stage.tier === 'N2'
                          ? 'text-sky-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.tierLabel}
                    </span>
                  </div>
                  <p className="mt-1 pl-7 text-xs text-slate-400">{stage.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Right: Active Stage Specification Panel */}
          <div
            role="tabpanel"
            aria-label={`Detalhes do estágio ${activeStage.number}`}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0A0B0E] p-6 sm:p-8 lg:col-span-6"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
                  <span>Estágio {activeStage.number}</span>
                  <span className="text-slate-600" aria-hidden="true">/</span>
                  <span>{activeStage.tierLabel}</span>
                </div>
                {activeStage.tier === 'PR' && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-amber-300">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <span>Zero Merge Automático</span>
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-50">{activeStage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                <GlossaryText text={activeStage.description} />
              </p>

              <dl className="mt-6 space-y-4 border-t border-slate-800 pt-5 text-sm">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                  <dt className="font-mono text-xs text-slate-400">Entrada</dt>
                  <dd className="sm:col-span-2 text-slate-200">
                    <GlossaryText text={activeStage.inputArtifact} />
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                  <dt className="font-mono text-xs text-slate-400">Guardrail</dt>
                  <dd className="sm:col-span-2 text-sky-300">
                    <GlossaryText text={activeStage.guardrail} />
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                  <dt className="font-mono text-xs text-slate-400">Saída auditável</dt>
                  <dd className="sm:col-span-2 font-medium text-emerald-400">
                    <GlossaryText text={activeStage.outputArtifact} />
                  </dd>
                </div>
              </dl>
            </div>

            {/* Dedicated Human-in-the-Loop Guarantee Callout */}
            <div className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3.5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold text-amber-200">
                    Governança Corporativa · Human-in-the-Loop Obrigatório
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    <GlossaryText text="Nenhuma alteração chega à produção sem revisão humana. Todo PR nasce com laudo de RCA, validação DRY e testes aprovados em sandbox — e cada revisão alimenta a memória arquitetural da empresa." />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
