import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDiagnosticPayload,
  buildMailtoHref,
  buildWhatsAppHref,
  formatDiagnosticBriefingText,
  submitDiagnosticLead,
} from './leadSubmission';
import { DiagnosticFormValues } from './pipelineLogic';

const SAMPLE_VALUES: DiagnosticFormValues = {
  name: 'Rafael Mendes',
  email: 'rafael@payflow.com.br',
  companyAndRole: 'Head de Engenharia na PayFlow',
  teamAndStack: '14 devs · TypeScript, Supabase, Workers',
  planId: 'poc',
  bottleneck: 'Webhooks duplicados consomem tempo dos engenheiros sêniores.',
};

test('leadSubmission formats structured briefing, mailto, and WhatsApp links accurately', () => {
  const payload = buildDiagnosticPayload(SAMPLE_VALUES, 'PoC de Velocidade', '2026-11-24T18:00:00.000Z');
  const text = formatDiagnosticBriefingText(payload);

  assert.ok(text.includes('Modelo: PoC de Velocidade'));
  assert.ok(text.includes('Empresa & Cargo: Head de Engenharia na PayFlow'));

  const mailto = buildMailtoHref(payload, 'arquitetura@hexaflow.dev');
  assert.ok(mailto.startsWith('mailto:arquitetura@hexaflow.dev?subject='));
  assert.ok(mailto.includes(encodeURIComponent('Head de Engenharia na PayFlow')));

  assert.equal(buildWhatsAppHref(payload, ''), null);
  assert.equal(buildWhatsAppHref(payload, '123'), null);
  const wa = buildWhatsAppHref(payload, '+55 (11) 99999-8888');
  assert.ok(wa?.startsWith('https://wa.me/5511999998888?text='));
});

test('submitDiagnosticLead supports direct handoff, webhook success, and failure fallback', async () => {
  const direct = await submitDiagnosticLead(SAMPLE_VALUES, 'PoC de Velocidade', {
    contactEmail: 'contato@hexaflow.dev',
  });
  assert.equal(direct.status, 'direct_handoff');
  assert.ok(direct.mailtoHref.startsWith('mailto:contato@hexaflow.dev'));

  let calledUrl = '';
  const mockSuccessFetch = (async (input: RequestInfo | URL) => {
    calledUrl = String(input);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }) as typeof fetch;

  const delivered = await submitDiagnosticLead(
    SAMPLE_VALUES,
    'PoC de Velocidade',
    {
      endpoint: 'https://leads.example.workers.dev/diagnostic',
      bookingUrl: 'https://cal.com/hexaflow/diagnostico',
    },
    mockSuccessFetch
  );
  assert.equal(calledUrl, 'https://leads.example.workers.dev/diagnostic');
  assert.equal(delivered.status, 'endpoint_delivered');
  assert.equal(delivered.bookingUrl, 'https://cal.com/hexaflow/diagnostico');

  const mockErrorFetch = (async () => {
    return new Response('Server error', { status: 502 });
  }) as typeof fetch;

  const fallback = await submitDiagnosticLead(
    SAMPLE_VALUES,
    'PoC de Velocidade',
    {
      endpoint: 'https://leads.example.workers.dev/diagnostic',
      contactEmail: 'contato@hexaflow.dev',
    },
    mockErrorFetch
  );
  assert.equal(fallback.status, 'endpoint_failed_fallback');
  assert.ok(fallback.errorMessage);
  assert.ok(fallback.mailtoHref.startsWith('mailto:contato@hexaflow.dev'));
});
