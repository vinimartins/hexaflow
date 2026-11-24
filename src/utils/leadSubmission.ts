import { DiagnosticFormValues } from './pipelineLogic';

export interface LeadDeliveryConfig {
  endpoint?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  bookingUrl?: string;
}

export interface DiagnosticLeadPayload extends DiagnosticFormValues {
  planName: string;
  submittedAt: string;
  source: 'hexaflow-landing';
}

export type LeadSubmissionStatus =
  | 'endpoint_delivered'
  | 'direct_handoff'
  | 'endpoint_failed_fallback';

export interface LeadSubmissionResult {
  status: LeadSubmissionStatus;
  payload: DiagnosticLeadPayload;
  briefingText: string;
  mailtoHref: string;
  whatsappHref: string | null;
  bookingUrl: string | null;
  errorMessage?: string;
}

const DEFAULT_CONTACT_EMAIL = 'contato@hexaflow.dev';

export function buildDiagnosticPayload(
  values: DiagnosticFormValues,
  planName: string,
  submittedAt: string = new Date().toISOString()
): DiagnosticLeadPayload {
  return {
    ...values,
    planName,
    submittedAt,
    source: 'hexaflow-landing',
  };
}

export function formatDiagnosticBriefingText(payload: DiagnosticLeadPayload): string {
  return [
    'Solicitação de Diagnóstico B2B — HexaFlow',
    `Modelo: ${payload.planName}`,
    `Nome: ${payload.name}`,
    `E-mail Corporativo: ${payload.email}`,
    `Empresa & Cargo: ${payload.companyAndRole}`,
    `Time & Stack: ${payload.teamAndStack}`,
    `Gargalo Operacional (N1/N2): ${payload.bottleneck}`,
  ].join('\n');
}

export function buildMailtoHref(
  payload: DiagnosticLeadPayload,
  contactEmail: string = DEFAULT_CONTACT_EMAIL
): string {
  const recipient = contactEmail.trim() || DEFAULT_CONTACT_EMAIL;
  const subject = `[HexaFlow B2B] Diagnóstico — ${payload.planName} (${payload.companyAndRole})`;
  const body = formatDiagnosticBriefingText(payload);
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildWhatsAppHref(
  payload: DiagnosticLeadPayload,
  whatsappNumber?: string
): string | null {
  const digits = (whatsappNumber ?? '').replace(/\D/g, '');
  if (digits.length < 10) {
    return null;
  }
  const text = formatDiagnosticBriefingText(payload);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export async function submitDiagnosticLead(
  values: DiagnosticFormValues,
  planName: string,
  config: LeadDeliveryConfig,
  fetchImpl: typeof fetch = fetch
): Promise<LeadSubmissionResult> {
  const payload = buildDiagnosticPayload(values, planName);
  const briefingText = formatDiagnosticBriefingText(payload);
  const mailtoHref = buildMailtoHref(payload, config.contactEmail);
  const whatsappHref = buildWhatsAppHref(payload, config.whatsappNumber);
  const bookingUrl = config.bookingUrl?.trim() ? config.bookingUrl.trim() : null;
  const endpoint = config.endpoint?.trim() ?? '';

  if (!endpoint) {
    return {
      status: 'direct_handoff',
      payload,
      briefingText,
      mailtoHref,
      whatsappHref,
      bookingUrl,
    };
  }

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        _subject: `[HexaFlow B2B] ${payload.planName} — ${payload.companyAndRole}`,
      }),
    });

    if (!response.ok) {
      return {
        status: 'endpoint_failed_fallback',
        payload,
        briefingText,
        mailtoHref,
        whatsappHref,
        bookingUrl,
        errorMessage: 'Não foi possível confirmar o envio automático. Utilize o envio direto abaixo para concluir.',
      };
    }

    return {
      status: 'endpoint_delivered',
      payload,
      briefingText,
      mailtoHref,
      whatsappHref,
      bookingUrl,
    };
  } catch {
    return {
      status: 'endpoint_failed_fallback',
      payload,
      briefingText,
      mailtoHref,
      whatsappHref,
      bookingUrl,
      errorMessage: 'Falha de conexão com o destino configurado. Utilize o envio direto abaixo para concluir.',
    };
  }
}
