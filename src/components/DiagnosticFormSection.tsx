import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MessageSquare,
  RotateCcw,
  Send,
} from 'lucide-react';
import { RevealSection } from './RevealSection';
import { Toast } from './Toast';
import { GlossaryText } from './TechTerm';
import {
  DiagnosticFormErrors,
  PLAN_OPTIONS,
  PlanOption,
  validateDiagnosticForm,
} from '../utils/pipelineLogic';
import {
  LeadDeliveryConfig,
  LeadSubmissionResult,
  submitDiagnosticLead,
} from '../utils/leadSubmission';

interface DiagnosticFormSectionProps {
  selectedPlanId: PlanOption['id'];
  onChangePlan: (planId: PlanOption['id']) => void;
  selectionEpoch?: number;
}

const LEAD_CONFIG: LeadDeliveryConfig = {
  endpoint: import.meta.env.VITE_LEAD_ENDPOINT,
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER,
  bookingUrl: import.meta.env.VITE_BOOKING_URL,
};

export function DiagnosticFormSection({
  selectedPlanId,
  onChangePlan,
  selectionEpoch = 0,
}: DiagnosticFormSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyAndRole, setCompanyAndRole] = useState('');
  const [teamAndStack, setTeamAndStack] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [errors, setErrors] = useState<DiagnosticFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LeadSubmissionResult | null>(null);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [lastEpoch, setLastEpoch] = useState(selectionEpoch);

  if (selectionEpoch !== lastEpoch) {
    setLastEpoch(selectionEpoch);
    if (submissionResult) {
      setSubmissionResult(null);
    }
    if (toastOpen) {
      setToastOpen(false);
    }
    if (copiedBriefing) {
      setCopiedBriefing(false);
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const result = validateDiagnosticForm({
      name,
      email,
      companyAndRole,
      teamAndStack,
      planId: selectedPlanId,
      bottleneck,
    });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setCopiedBriefing(false);

    const planName = PLAN_OPTIONS.find((p) => p.id === result.sanitized.planId)?.name ?? 'PoC de Velocidade';
    const delivery = await submitDiagnosticLead(result.sanitized, planName, LEAD_CONFIG);

    setIsSubmitting(false);
    setSubmissionResult(delivery);
    setToastOpen(true);
  };

  const handleCopyBriefing = async () => {
    if (!submissionResult) return;
    try {
      await navigator.clipboard.writeText(submissionResult.briefingText);
      setCopiedBriefing(true);
      window.setTimeout(() => setCopiedBriefing(false), 2500);
    } catch {
      setCopiedBriefing(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setToastOpen(false);
    setCopiedBriefing(false);
    setName('');
    setEmail('');
    setCompanyAndRole('');
    setTeamAndStack('');
    setBottleneck('');
    setErrors({});
  };

  const selectedPlanName =
    PLAN_OPTIONS.find((p) => p.id === (submissionResult?.payload.planId ?? selectedPlanId))?.name ??
    'PoC de Velocidade';

  const submittedData = submissionResult?.payload ?? null;
  const isFallbackWarning = submissionResult?.status === 'endpoint_failed_fallback';
  const isWebhookDelivered = submissionResult?.status === 'endpoint_delivered';

  return (
    <section id="diagnostico" className="border-b border-slate-800/80 bg-[#040507] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Pitch */}
          <RevealSection className="lg:col-span-5">
            <p className="font-mono text-xs font-medium text-sky-400">06. Diagnóstico B2B</p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Implante uma célula autônoma de engenharia com rigor arquitetural.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Sessão executiva direta com arquitetos de software. Mapeamos sua fila corporativa N1/N2, fronteiras
              hexagonais e política de revisão para estruturar sua PoC em 2 semanas.
            </p>

            <dl className="mt-8 space-y-4 border-t border-slate-800 pt-6 text-sm">
              <div>
                <dt className="font-semibold text-slate-100">Conversa técnica entre pares</dt>
                <dd className="mt-1 text-slate-400">
                  <GlossaryText text="Sem pitch genérico: avaliamos Blast Radius, runners sandboxed, DRY, Ports & Adapters e Human-in-the-Loop." />
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-100">Modelo selecionado</dt>
                <dd className="mt-1 font-mono text-xs text-emerald-400">{selectedPlanName}</dd>
              </div>
            </dl>
          </RevealSection>

          {/* Right Form or Confirmation */}
          <RevealSection
            delay={0.08}
            className="rounded-xl border border-slate-800 bg-[#0A0B0E] p-6 sm:p-8 lg:col-span-7"
          >
            {submittedData && submissionResult ? (
              <div data-testid="diagnostic-confirmation" className="space-y-5">
                <div className="flex items-start gap-3">
                  {isFallbackWarning ? (
                    <AlertTriangle className="mt-0.5 h-6 w-6 text-amber-300 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-400 shrink-0" aria-hidden="true" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-50">
                      {isWebhookDelivered
                        ? 'Diagnóstico B2B Enviado'
                        : isFallbackWarning
                        ? 'Conclua o Envio Direto'
                        : 'Briefing B2B Pronto para Envio'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                      {isWebhookDelivered ? (
                        <>
                          Recebemos os parâmetros operacionais de{' '}
                          <strong className="text-slate-100">{submittedData.name}</strong>. Um arquiteto responderá
                          para <span className="font-mono text-sky-300 break-words">{submittedData.email}</span> com o
                          plano da PoC.
                        </>
                      ) : isFallbackWarning ? (
                        submissionResult.errorMessage
                      ) : (
                        <>
                          Os parâmetros operacionais de{' '}
                          <strong className="text-slate-100">{submittedData.name}</strong> estão formatados. Envie
                          diretamente por e-mail pré-preenchido ou copie o briefing para concluir seu agendamento.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-3 rounded-lg border border-slate-800 bg-[#12141A] p-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">Empresa &amp; Cargo</dt>
                    <dd className="mt-0.5 font-medium text-slate-100">{submittedData.companyAndRole}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Modelo de Contratação</dt>
                    <dd className="mt-0.5 font-mono text-emerald-400">{selectedPlanName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-slate-400">Tamanho do Time &amp; Stack</dt>
                    <dd className="mt-0.5 font-mono text-slate-200">{submittedData.teamAndStack}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-slate-400">Gargalo Mapeado</dt>
                    <dd className="mt-0.5 text-slate-200 leading-relaxed">{submittedData.bottleneck}</dd>
                  </div>
                </dl>

                {/* Direct Real Delivery Destinations (E-mail / WhatsApp / Scheduling / Copy) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    data-testid="lead-mailto-link"
                    href={submissionResult.mailtoHref}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      isWebhookDelivered
                        ? 'border border-slate-700 bg-[#040507] text-slate-200 hover:border-slate-500 hover:text-white'
                        : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Enviar Briefing por E-mail</span>
                  </a>

                  {submissionResult.whatsappHref && (
                    <a
                      data-testid="lead-whatsapp-link"
                      href={submissionResult.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20 transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Enviar via WhatsApp</span>
                    </a>
                  )}

                  {submissionResult.bookingUrl && (
                    <a
                      data-testid="lead-booking-link"
                      href={submissionResult.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-sky-400/40 bg-sky-400/10 px-4 py-2.5 text-xs font-semibold text-sky-300 hover:bg-sky-400/20 transition-colors whitespace-nowrap"
                    >
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Escolher Horário</span>
                    </a>
                  )}

                  <button
                    type="button"
                    data-testid="lead-copy-btn"
                    onClick={handleCopyBriefing}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#040507] px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedBriefing ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        <span>Briefing Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copiar Briefing</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-[#040507] px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Nova solicitação</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="diag-name" className="block text-xs font-medium text-slate-200">
                      Nome
                    </label>
                    <input
                      id="diag-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex.: Rafael Mendes"
                      aria-invalid={Boolean(errors.name)}
                      className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="diag-email" className="block text-xs font-medium text-slate-200">
                      E-mail Corporativo
                    </label>
                    <input
                      id="diag-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rafael@payflow.com.br"
                      aria-invalid={Boolean(errors.email)}
                      className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="diag-company-role" className="block text-xs font-medium text-slate-200">
                      Empresa &amp; Cargo
                    </label>
                    <input
                      id="diag-company-role"
                      name="companyAndRole"
                      type="text"
                      value={companyAndRole}
                      onChange={(e) => setCompanyAndRole(e.target.value)}
                      placeholder="Ex.: CTO na PayFlow (SaaS)"
                      aria-invalid={Boolean(errors.companyAndRole)}
                      className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    {errors.companyAndRole && (
                      <p className="mt-1 text-xs text-rose-400">{errors.companyAndRole}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="diag-team-stack" className="block text-xs font-medium text-slate-200">
                      Tamanho do Time &amp; Stack
                    </label>
                    <input
                      id="diag-team-stack"
                      name="teamAndStack"
                      type="text"
                      value={teamAndStack}
                      onChange={(e) => setTeamAndStack(e.target.value)}
                      placeholder="Ex.: 28 devs · TS, Node, Supabase"
                      aria-invalid={Boolean(errors.teamAndStack)}
                      className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    {errors.teamAndStack && <p className="mt-1 text-xs text-rose-400">{errors.teamAndStack}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="diag-plan" className="block text-xs font-medium text-slate-200">
                    Modelo de Contratação
                  </label>
                  <select
                    id="diag-plan"
                    name="planId"
                    value={selectedPlanId}
                    onChange={(e) => onChangePlan(e.target.value as PlanOption['id'])}
                    className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  >
                    {PLAN_OPTIONS.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.cadence})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="diag-bottleneck" className="block text-xs font-medium text-slate-200">
                    Principal Gargalo Operacional (N1/N2)
                  </label>
                  <textarea
                    id="diag-bottleneck"
                    name="bottleneck"
                    rows={3}
                    value={bottleneck}
                    onChange={(e) => setBottleneck(e.target.value)}
                    placeholder="Ex.: 40% da semana sênior vai para bugs, webhooks falhando e N1/N2 — queremos IA sem quebrar Hexagonal/DRY."
                    aria-invalid={Boolean(errors.bottleneck)}
                    className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#040507] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                  {errors.bottleneck && <p className="mt-1 text-xs text-rose-400">{errors.bottleneck}</p>}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-60 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Enviando solicitação...' : 'Agendar Diagnóstico B2B'}</span>
                  </button>
                </div>
              </form>
            )}
          </RevealSection>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        variant={isFallbackWarning ? 'error' : 'success'}
        title={
          isWebhookDelivered
            ? 'Diagnóstico B2B enviado com sucesso'
            : isFallbackWarning
            ? 'Conclua pelo canal direto abaixo'
            : 'Briefing B2B estruturado com sucesso'
        }
        description={
          submittedData
            ? `${selectedPlanName} · ${isWebhookDelivered ? `Retorno para ${submittedData.email}` : 'Pronto para envio direto'}`
            : undefined
        }
        testId="diagnostic-toast"
      />
    </section>
  );
}
