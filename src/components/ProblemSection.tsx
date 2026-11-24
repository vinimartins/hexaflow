import { Cpu, User } from 'lucide-react';
import { RevealSection } from './RevealSection';
import { RoiCalculator } from './RoiCalculator';
import { TechTerm } from './TechTerm';

interface ProblemSectionProps {
  onSelectPoc?: () => void;
}

export function ProblemSection({ onSelectPoc }: ProblemSectionProps) {
  return (
    <section id="gargalo" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-sky-400">01. O Gargalo em Times SaaS &amp; Tech (10 a 80 Devs)</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
            Incêndios N1/N2 drenam 40% da semana sênior — e IA sem governança destrói a arquitetura.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Para CTOs, Heads de Engenharia e Tech Leads, o dilema é duplo: deixar os sêniores presos em bugs e webhooks
            atrasa features de receita, mas colocar agentes genéricos no repositório sem controle rompe a arquitetura.
          </p>
        </RevealSection>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Block 1: Dor 1 & Risco da IA Genérica */}
          <RevealSection delay={0.05}>
            <article className="flex h-full flex-col justify-between rounded-xl border border-slate-800 bg-[#0A0B0E] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-medium text-slate-400">Dor Real · Sustentação vs. IA Caótica</span>
                  <User className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-100">
                  40% da semana em incêndios + medo legítimo da IA no repo
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  Bugs em produção, webhooks falhando e chamados N1/N2 do suporte arrancam seus devs sêniores das
                  entregas que trazem receita. Ao mesmo tempo, agentes genéricos duplicam helpers (quebrando{' '}
                  <TechTerm termKey="dry">DRY</TechTerm>), furam a{' '}
                  <TechTerm termKey="hexagonal">Arquitetura Hexagonal</TechTerm> e vazam regras do{' '}
                  <TechTerm termKey="core_domain">Core Domain</TechTerm> para adapters.
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                <div>
                  <dt className="text-xs text-slate-400">Capacidade drenada</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-slate-200">Até 40% da semana</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Risco no repositório</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-slate-200">Quebra Hexagonal &amp; DRY</dd>
                </div>
              </dl>
            </article>
          </RevealSection>

          {/* Block 2: Motor Corporativo B2B HexaFlow */}
          <RevealSection delay={0.12}>
            <article className="flex h-full flex-col justify-between rounded-xl border border-sky-400/40 bg-[#12141A] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-medium text-sky-300">Solução B2B · Governança Arquitetural</span>
                  <Cpu className="h-5 w-5 text-sky-400 shrink-0" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-50">
                  Esteira autônoma que devolve o roadmap sem tocar no domínio
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-200">
                  O HexaFlow absorve a fila de incidentes com <TechTerm termKey="sla">SLA</TechTerm> N1, isola causa
                  raiz em <TechTerm termKey="sandbox">sandbox</TechTerm> N2 e gera o patch N3 respeitando{' '}
                  <TechTerm termKey="ports_adapters">Ports &amp; Adapters</TechTerm> e{' '}
                  <TechTerm termKey="dry">DRY</TechTerm>. Seus sêniores param de apagar incêndio e apenas revisam PRs
                  limpos e testados.
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700/80 pt-5">
                <div>
                  <dt className="text-xs text-slate-300">Foco do time sênior</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-emerald-400">Features de receita</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-300">Blindagem técnica</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-sky-300">Hexagonal + DRY</dd>
                </div>
              </dl>
            </article>
          </RevealSection>
        </div>

        <RoiCalculator onSelectPoc={onSelectPoc} />
      </div>
    </section>
  );
}
