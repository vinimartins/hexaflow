import { Check, Minus } from 'lucide-react';
import { COMPARISON_ROWS } from '../utils/pipelineLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

export function ComparisonSection() {
  return (
    <section id="diferenciais" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-sky-400">03. Governança &amp; Comparativo B2B</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
            Copilotos &amp; Bots Genéricos vs. Esteira B2B HexaFlow.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            <GlossaryText text="Comparativo executivo entre ferramentas individuais no editor e uma infraestrutura corporativa governada por ITIL, Arquitetura Hexagonal (Ports & Adapters), DRY e Human-in-the-Loop." />
          </p>
        </RevealSection>

        {/* Mobile stacked comparison (avoids clipped 3rd column on 390px) */}
        <RevealSection delay={0.08} className="mt-8 space-y-4 md:hidden">
          {COMPARISON_ROWS.map((row) => (
            <article key={row.criterion} className="rounded-xl border border-slate-800 bg-[#0A0B0E] p-4">
              <h3 className="text-sm font-semibold text-slate-100">{row.criterion}</h3>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="rounded-md border border-slate-800/80 bg-[#040507] p-3">
                  <div className="font-mono text-[11px] text-slate-400">Copilotos &amp; Bots Genéricos</div>
                  <div className="mt-1 flex items-start gap-2 text-slate-300">
                    <Minus className="mt-0.5 h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed">
                      <GlossaryText text={row.generic} />
                    </span>
                  </div>
                </div>
                <div className="rounded-md border border-sky-400/35 bg-[#12141A] p-3">
                  <div className="font-mono text-[11px] text-emerald-400">Esteira B2B HexaFlow</div>
                  <div className="mt-1 flex items-start gap-2 text-slate-100">
                    <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed">
                      <GlossaryText text={row.hexaflow} />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </RevealSection>

        {/* Desktop semantic comparison table */}
        <RevealSection delay={0.08} className="mt-10 hidden md:block overflow-hidden rounded-xl border border-slate-800 bg-[#0A0B0E]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-[#07080B]">
                  <th scope="col" className="w-1/4 px-5 py-4 font-mono text-xs font-semibold text-slate-400">
                    Critério de Governança
                  </th>
                  <th scope="col" className="w-[37.5%] px-5 py-4 text-sm font-semibold text-slate-300">
                    Copilotos &amp; Bots Genéricos
                  </th>
                  <th scope="col" className="w-[37.5%] px-5 py-4 text-sm font-semibold text-sky-300 bg-[#12141A]">
                    Esteira B2B HexaFlow
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.criterion} className="hover:bg-slate-800/25 transition-colors">
                    <th scope="row" className="px-5 py-4 align-top font-semibold text-slate-100">
                      {row.criterion}
                    </th>
                    <td className="px-5 py-4 align-top text-slate-400">
                      <div className="flex items-start gap-2.5">
                        <Minus className="mt-0.5 h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <span className="leading-relaxed">
                          <GlossaryText text={row.generic} />
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-100 bg-[#12141A]/75">
                      <div className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                        <span className="leading-relaxed">
                          <GlossaryText text={row.hexaflow} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
