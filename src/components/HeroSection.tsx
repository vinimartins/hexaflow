import { ArrowRight, Layers } from 'lucide-react';
import { PipelineSimulator } from './PipelineSimulator';
import { RevealSection } from './RevealSection';
import { GlossaryText, TechTerm } from './TechTerm';

interface HeroSectionProps {
  onSelectPoc: () => void;
}

const HERO_IMPACT_METRICS = [
  {
    value: 'Até 40%',
    label: 'Capacidade sênior recuperada',
    detail: 'Devolva ao roadmap o tempo perdido com bugs, webhooks falhando e chamados N1/N2',
  },
  {
    value: '100%',
    label: 'Aprovação humana via PR',
    detail: 'Governança Human-in-the-Loop rigorosa com zero merge automático',
  },
  {
    value: 'Zero',
    label: 'Vazamento de domínio ou duplicação',
    detail: 'Guardrails de Arquitetura Hexagonal (Ports & Adapters), DRY e Clean Code',
  },
];

export function HeroSection({ onSelectPoc }: HeroSectionProps) {
  return (
    <section id="topo" className="relative border-b border-slate-800/80 bg-[#040507] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Copy Column */}
          <RevealSection immediate yOffset={14} className="flex flex-col justify-between lg:col-span-6">
            <div>
              {/* Clean unboxed typographic metadata kicker */}
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 font-mono text-xs tracking-wide text-sky-400">
                <span>SaaS &amp; Tech · Times de 10 a 80 Devs</span>
                <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
                <span className="text-emerald-400">Autonomous Engineering Ops</span>
              </div>

              <h1
                className="mt-3.5 font-semibold tracking-tight text-slate-50 leading-[1.12]"
                style={{ fontSize: 'clamp(1.95rem, 3vw, 2.75rem)', textWrap: 'balance' }}
              >
                Pare de gastar 40% da semana dos seus devs sêniores apagando incêndio.
              </h1>

              <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Bugs em produção, webhooks falhando e chamados N1/N2 do suporte roubam quem deveria entregar features
                de receita. O HexaFlow assume a sustentação sob governança <TechTerm termKey="itil">ITIL</TechTerm>{' '}
                (N1 → N2 → N3 → PR), protegendo sua{' '}
                <TechTerm termKey="hexagonal">Arquitetura Hexagonal</TechTerm> (
                <TechTerm termKey="ports_adapters">Ports &amp; Adapters</TechTerm>),{' '}
                <TechTerm termKey="dry">DRY</TechTerm> e <TechTerm termKey="clean_code">Clean Code</TechTerm> — sem
                vazar regra de negócio nem fazer auto-merge.
              </p>

              {/* Primary + Secondary CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onSelectPoc}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-400 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-sky-300 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040507]"
                >
                  <span>Agendar PoC Corporativa (2 Semanas)</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href="#gargalo"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-[#0A0B0E] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-[#12141A] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Layers className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  <span>Ver Dores &amp; Proteção Hexagonal</span>
                </a>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-800/80 pt-4">
              <p className="text-xs text-slate-400">
                Desenhado para CTOs, Heads de Engenharia e Tech Leads de operações SaaS &amp; Tech com 10 a 80 devs.
                Passe o cursor ou toque nos termos destacados para ver os detalhes técnicos.
              </p>
            </div>
          </RevealSection>

          {/* Right Simulator Column */}
          <RevealSection immediate delay={0.08} yOffset={16} className="lg:col-span-6">
            <PipelineSimulator />
          </RevealSection>
        </div>

        {/* 3 Executive Impact Metrics Strip Below Split */}
        <RevealSection immediate delay={0.14} yOffset={12}>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 md:grid-cols-3">
            {HERO_IMPACT_METRICS.map((item) => (
              <div key={item.label} className="bg-[#0A0B0E] px-5 py-4">
                <div className="font-mono text-xl font-semibold text-sky-400 tabular-nums">{item.value}</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">
                  <GlossaryText text={item.label} />
                </div>
                <div className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  <GlossaryText text={item.detail} />
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
