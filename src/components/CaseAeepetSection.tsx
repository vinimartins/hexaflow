import { ArrowUpRight } from 'lucide-react';
import { RevealSection } from './RevealSection';
import { GlossaryText, TechTerm } from './TechTerm';

const AEEPET_RESULTS = [
  {
    metric: '-72%',
    label: 'Tempo entre incidente N1 e PR pronto',
    detail: 'Triagem, reprodução em sandbox e RCA entregues antes do código entrar na fila do Tech Lead.',
  },
  {
    metric: '100%',
    label: 'Conformidade Ports & Adapters + E2E',
    detail: 'Adapters de WhatsApp, Google Calendar, Supabase e Workers isolados com testes E2E obrigatórios.',
  },
  {
    metric: '0',
    label: 'Merges automáticos ou vazamento de domínio',
    detail: 'Todo Pull Request passa por auditoria DRY e aprovação explícita Human-in-the-Loop.',
  },
];

export function CaseAeepetSection() {
  return (
    <section id="case-aeepet" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="rounded-xl border border-slate-800 bg-[#0A0B0E] p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Case Narrative */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-sky-400">
                <span>04. Case B2B · Cliente Zero</span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span>AEEPET</span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-emerald-400">Operação Piloto em Produção</span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl" style={{ textWrap: 'balance' }}>
                Cliente Zero AEEPET: sustentação autônoma em SaaS crítico com WhatsApp, Google Calendar, Supabase e Workers.
              </h2>

              <div className="mt-7 space-y-5 text-sm leading-relaxed text-slate-300">
                <div className="rounded-lg border border-slate-800/90 bg-[#040507] p-4">
                  <h3 className="font-mono text-xs font-semibold text-sky-400">
                    01 · O Gargalo de Negócio
                  </h3>
                  <p className="mt-1.5">
                    A operação da AEEPET depende de um SaaS e sistema de gestão operacional com integrações críticas em{' '}
                    <strong className="text-slate-100 font-medium">WhatsApp</strong>,{' '}
                    <strong className="text-slate-100 font-medium">Google Calendar</strong>,{' '}
                    <TechTerm termKey="supabase">Supabase</TechTerm> e{' '}
                    <TechTerm termKey="workers">Cloudflare Workers</TechTerm>. Chamados N1/N2 de
                    sincronismo e webhooks drenavam a engenharia sênior, enquanto copilotos genéricos quebravam as
                    fronteiras da <TechTerm termKey="hexagonal">Arquitetura Hexagonal</TechTerm>.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-[#040507] p-4">
                  <h3 className="font-mono text-xs font-semibold text-sky-400">
                    02 · A Implantação HexaFlow
                  </h3>
                  <p className="mt-1.5">
                    Conectamos a esteira B2B diretamente ao fluxo de incidentes e ao repositório da AEEPET sob governança{' '}
                    <TechTerm termKey="itil">ITIL</TechTerm> (N1 → N2 → N3). Cada ticket passou a ter{' '}
                    <TechTerm termKey="rca">RCA</TechTerm> e <TechTerm termKey="blast_radius">Blast Radius</TechTerm>{' '}
                    delimitados antes da escrita de código em <TechTerm termKey="sandbox">sandbox</TechTerm>,
                    respeitando <TechTerm termKey="ports_adapters">Ports &amp; Adapters</TechTerm>,{' '}
                    <TechTerm termKey="dry">DRY</TechTerm> e validação em{' '}
                    <TechTerm termKey="e2e">testes E2E</TechTerm>.
                  </p>
                </div>

                <div className="rounded-lg border border-sky-400/25 bg-[#12141A] p-4">
                  <h3 className="font-mono text-xs font-semibold text-emerald-400">
                    03 · O Impacto Operacional
                  </h3>
                  <p className="mt-1.5 text-slate-200">
                    A fila operacional deixou de interromper o roadmap principal: incidentes recorrentes passaram a
                    chegar para o Tech Lead como Pull Requests limpos, rastreáveis e testados, elevando a previsibilidade
                    da operação sem gerar dívida técnica nem depender de auto-merge.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-xs text-slate-400">
                  Stack validada: <span className="text-slate-200">WhatsApp · Google Calendar · Supabase · Cloudflare Workers · Testes E2E</span>
                </p>
                <a
                  href="#diagnostico"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Replicar modelo na sua operação</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Quantified Results Column */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-5">
              {AEEPET_RESULTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-800/90 bg-[#12141A]/75 p-5"
                >
                  <div className="font-mono text-2xl font-semibold text-emerald-400 tabular-nums">{item.metric}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-100">
                    <GlossaryText text={item.label} />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    <GlossaryText text={item.detail} />
                  </p>
                </div>
              ))}
              <p className="px-1 font-mono text-[11px] leading-relaxed text-slate-400">
                * Métricas aferidas na operação piloto da AEEPET em chamados de integração N1/N2 com execução sandboxed e revisão humana.
              </p>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
