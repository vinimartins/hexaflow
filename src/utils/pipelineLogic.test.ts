import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PIPELINE_SCENARIOS,
  ITIL_STAGES,
  PLAN_OPTIONS,
  COMPARISON_ROWS,
  FAQ_ITEMS,
  CODE_TRANSFORMATIONS,
  TECHNICAL_GLOSSARY,
  getScenarioById,
  getVisibleLogs,
  getStageProgressPercent,
  validateDiagnosticForm,
  toggleFaqId,
  getCodeTransformationByTier,
  tokenizeGlossaryText,
  computeTooltipPosition,
} from './pipelineLogic';

test('all pipeline scenarios enforce 5 logs, SLA tracking, and Human-in-the-Loop (zero auto-merge)', () => {
  assert.equal(ITIL_STAGES.length, 5);
  assert.deepEqual(
    ITIL_STAGES.map((s) => s.tier),
    ['N1', 'N2', 'N3', 'PR', 'LOOP']
  );
  assert.ok(PIPELINE_SCENARIOS.length >= 3);

  for (const scenario of PIPELINE_SCENARIOS) {
    assert.equal(scenario.humanApprovalRequired, true);
    assert.equal(scenario.logs.length, 5);
    assert.equal(scenario.logs[0].tier, 'N1');
    assert.equal(scenario.logs[4].tier, 'N3');
    assert.equal(scenario.logs[4].status, 'awaiting_human');
    assert.ok(scenario.slaSummary.length > 0);
  }
});

test('getScenarioById falls back safely and getVisibleLogs clamps bounds', () => {
  const fallback = getScenarioById('non-existent');
  assert.equal(fallback.id, PIPELINE_SCENARIOS[0].id);

  const twoLogs = getVisibleLogs(fallback, 2);
  assert.equal(twoLogs.length, 2);

  const clampedMax = getVisibleLogs(fallback, 99);
  assert.equal(clampedMax.length, 5);

  assert.equal(getStageProgressPercent(3, 5), 60);
  assert.equal(getStageProgressPercent(5, 5), 100);
});

test('B2B plan options and comparison rows match required dimensions', () => {
  assert.deepEqual(
    PLAN_OPTIONS.map((p) => p.id),
    ['poc', 'core', 'governance']
  );
  assert.equal(PLAN_OPTIONS[1].highlighted, true);
  assert.equal(COMPARISON_ROWS.length, 5);
});

test('validateDiagnosticForm rejects invalid fields and normalizes valid executive submission', () => {
  const invalid = validateDiagnosticForm({
    name: 'A',
    email: 'not-an-email',
    companyAndRole: 'CT',
    teamAndStack: 'TS',
    planId: 'poc',
    bottleneck: 'curto',
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.companyAndRole);
  assert.ok(invalid.errors.teamAndStack);
  assert.ok(invalid.errors.bottleneck);

  const valid = validateDiagnosticForm({
    name: '  Marina Oliveira  ',
    email: ' marina@aeepet.com.br ',
    companyAndRole: ' AEEPET · CTO ',
    teamAndStack: ' 12 devs · TypeScript, Supabase, Cloudflare Workers ',
    planId: 'core',
    bottleneck: 'Fila N1/N2 de integrações consome 40% da capacidade sênior.',
  });

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.sanitized.name, 'Marina Oliveira');
  assert.equal(valid.sanitized.email, 'marina@aeepet.com.br');
  assert.equal(valid.sanitized.companyAndRole, 'AEEPET · CTO');
});

test('FAQ items cover ITIL governance and Hexagonal security and toggleFaqId toggles cleanly', () => {
  assert.ok(FAQ_ITEMS.length >= 5);
  const categories = new Set(FAQ_ITEMS.map((item) => item.category));
  assert.ok(categories.has('Arquitetura Hexagonal'));
  assert.ok(categories.has('Governança ITIL'));
  assert.ok(categories.has('Segurança & Sandbox'));

  for (const item of FAQ_ITEMS) {
    assert.ok(item.question.length > 10);
    assert.ok(item.answer.length > 30);
    assert.ok(item.guardrailNote.length > 10);
  }

  const opened = toggleFaqId(['hexagonal-boundaries'], 'zero-auto-merge');
  assert.deepEqual(opened, ['hexagonal-boundaries', 'zero-auto-merge']);

  const closed = toggleFaqId(opened, 'hexagonal-boundaries');
  assert.deepEqual(closed, ['zero-auto-merge']);
});

test('N1-N3 code transformations enforce Clean Code and Hexagonal before/after snippets', () => {
  assert.deepEqual(
    CODE_TRANSFORMATIONS.map((c) => c.tier),
    ['N1', 'N2', 'N3']
  );

  for (const tier of ['N1', 'N2', 'N3'] as const) {
    const item = getCodeTransformationByTier(tier);
    assert.equal(item.tier, tier);
    assert.ok(item.beforeCode.length >= 5);
    assert.ok(item.afterCode.length >= 5);
    assert.ok(item.principles.length >= 3);
  }
});

test('technical glossary tokenizes first occurrence of terms and clamps tooltip viewport bounds', () => {
  assert.ok(Object.keys(TECHNICAL_GLOSSARY).length >= 15);

  const tokens = tokenizeGlossaryText(
    'Sob governança ITIL, Ports & Adapters e DRY garantem Blast Radius contido. ITIL evita retrabalho.'
  );
  const termTokens = tokens.filter((t) => t.type === 'term');
  assert.deepEqual(
    termTokens.map((t) => t.key),
    ['itil', 'ports_adapters', 'dry', 'blast_radius']
  );

  // Near bottom-right edge should clamp left and flip above trigger
  const pos = computeTooltipPosition(
    { top: 760, bottom: 785, left: 1350, width: 60 },
    { width: 1440, height: 900 },
    { width: 320, height: 185 }
  );
  assert.equal(pos.placement, 'top');
  assert.ok(pos.left <= 1440 - 320 - 16);
  assert.ok(pos.top >= 16);
});
