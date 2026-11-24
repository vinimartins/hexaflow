export type PrDiffMode = 'split' | 'unified';
export type PrViewTab = 'files' | 'checks';
export type PrReviewDecision = 'pending' | 'approved' | 'changes_requested';

export interface PrDiffLine {
  type: 'context' | 'remove' | 'add';
  oldLine?: number;
  newLine?: number;
  code: string;
}

export interface PrSplitRow {
  left: PrDiffLine | null;
  right: PrDiffLine | null;
}

export interface PrFileDiff {
  id: string;
  path: string;
  layerBadge: string;
  cleanCodeRule: string;
  complexityBefore: number;
  complexityAfter: number;
  nestingBefore: number;
  nestingAfter: number;
  additions: number;
  deletions: number;
  hunkHeader: string;
  reviewAuthor: string;
  reviewNote: string;
  lines: PrDiffLine[];
}

export interface PrCheckItem {
  id: string;
  name: string;
  detail: string;
  duration: string;
  status: 'passed' | 'enforced';
}

export const PR_SIMULATION_META = {
  number: '#1084',
  title: 'fix(ops-422): aplicar Clean Code, Early Return e IdempotencyPort no fluxo de agenda',
  repository: 'aeepet/ops-management-saas',
  sourceBranch: 'hexaflow/n3-ops422-clean-code',
  targetBranch: 'main',
  author: 'hexaflow-ops[bot]',
  commitSha: '9f4c21e',
  ticketRef: 'ITIL OPS-422 · N3 Sandbox',
  totalAdditions: 28,
  totalDeletions: 28,
};

export const PR_DIFF_FILES: PrFileDiff[] = [
  {
    id: 'appointment-slot',
    path: 'domain/entities/AppointmentSlot.ts',
    layerBadge: 'Core Domain',
    cleanCodeRule: 'Early Return & Guard Clauses',
    complexityBefore: 6,
    complexityAfter: 2,
    nestingBefore: 4,
    nestingAfter: 1,
    additions: 10,
    deletions: 11,
    hunkHeader: '@@ -18,15 +18,13 @@ export class AppointmentSlot {',
    reviewAuthor: 'hexaflow-clean-code',
    reviewNote:
      'Eliminados 4 níveis de if aninhados com Guard Clauses e DomainResult explícito; removida chamada direta de SQL de dentro da entidade.',
    lines: [
      { type: 'context', oldLine: 18, newLine: 18, code: 'export class AppointmentSlot {' },
      { type: 'remove', oldLine: 19, code: '  async confirm(slot: any, db: any) {' },
      { type: 'remove', oldLine: 20, code: '    if (slot) {' },
      { type: 'remove', oldLine: 21, code: '      if (slot.status !== "CANCELLED") {' },
      { type: 'remove', oldLine: 22, code: '        if (new Date(slot.startsAt) > new Date()) {' },
      { type: 'remove', oldLine: 23, code: '          await db.query("UPDATE slots SET ok=1", [slot.id]);' },
      { type: 'remove', oldLine: 24, code: '          return true;' },
      { type: 'remove', oldLine: 25, code: '        }' },
      { type: 'remove', oldLine: 26, code: '      }' },
      { type: 'remove', oldLine: 27, code: '    }' },
      { type: 'remove', oldLine: 28, code: '    return false;' },
      { type: 'remove', oldLine: 29, code: '  }' },
      { type: 'add', newLine: 19, code: '  confirm(nowUtc: Instant): DomainResult<SlotConfirmed> {' },
      { type: 'add', newLine: 20, code: '    if (this.status === "CANCELLED") {' },
      { type: 'add', newLine: 21, code: '      return DomainResult.fail("SLOT_CANCELLED");' },
      { type: 'add', newLine: 22, code: '    }' },
      { type: 'add', newLine: 23, code: '    if (!this.startsAt.isAfter(nowUtc)) {' },
      { type: 'add', newLine: 24, code: '      return DomainResult.fail("SLOT_EXPIRED");' },
      { type: 'add', newLine: 25, code: '    }' },
      { type: 'add', newLine: 26, code: '    this.status = "CONFIRMED";' },
      { type: 'add', newLine: 27, code: '    return DomainResult.ok(new SlotConfirmed(this.id));' },
      { type: 'add', newLine: 28, code: '  }' },
      { type: 'context', oldLine: 30, newLine: 29, code: '}' },
    ],
  },
  {
    id: 'sync-calendar-usecase',
    path: 'application/use-cases/SyncCalendarUseCase.ts',
    layerBadge: 'Application Layer',
    cleanCodeRule: 'DRY & Inversão por Port',
    complexityBefore: 5,
    complexityAfter: 1,
    nestingBefore: 3,
    nestingAfter: 1,
    additions: 10,
    deletions: 10,
    hunkHeader: '@@ -8,14 +8,13 @@ export class SyncCalendarUseCase implements ScheduleSlotPort {',
    reviewAuthor: 'hexaflow-dry-auditor',
    reviewNote:
      'Substituído bloco duplicado de try/catch + setTimeout por reuso da policy canônica IdempotencyPort, isolando o Gateway de Agenda.',
    lines: [
      { type: 'context', oldLine: 8, newLine: 8, code: 'export class SyncCalendarUseCase implements ScheduleSlotPort {' },
      { type: 'remove', oldLine: 9, code: '  async sync(id: string, slot: string) {' },
      { type: 'remove', oldLine: 10, code: '    try {' },
      { type: 'remove', oldLine: 11, code: '      await fetch("https://www.googleapis.com/calendar/v3/...", {' },
      { type: 'remove', oldLine: 12, code: '        method: "POST", body: JSON.stringify({ id, slot })' },
      { type: 'remove', oldLine: 13, code: '      });' },
      { type: 'remove', oldLine: 14, code: '    } catch (e) {' },
      { type: 'remove', oldLine: 15, code: '      await new Promise((r) => setTimeout(r, 400));' },
      { type: 'remove', oldLine: 16, code: '      await fetch("https://www.googleapis.com/calendar/v3/...");' },
      { type: 'remove', oldLine: 17, code: '    }' },
      { type: 'remove', oldLine: 18, code: '  }' },
      { type: 'add', newLine: 9, code: '  constructor(' },
      { type: 'add', newLine: 10, code: '    private readonly calendar: CalendarGatewayPort,' },
      { type: 'add', newLine: 11, code: '    private readonly idempotency: IdempotencyPort' },
      { type: 'add', newLine: 12, code: '  ) {}' },
      { type: 'add', newLine: 13, code: '' },
      { type: 'add', newLine: 14, code: '  async execute(cmd: ScheduleCommand): Promise<void> {' },
      { type: 'add', newLine: 15, code: '    await this.idempotency.runOnce(cmd.eventKey, () =>' },
      { type: 'add', newLine: 16, code: '      this.calendar.upsertAppointment(cmd.slot)' },
      { type: 'add', newLine: 17, code: '    );' },
      { type: 'add', newLine: 18, code: '  }' },
      { type: 'context', oldLine: 19, newLine: 19, code: '}' },
    ],
  },
  {
    id: 'whatsapp-webhook-adapter',
    path: 'adapters/inbound/WhatsAppWebhookAdapter.ts',
    layerBadge: 'Inbound Adapter',
    cleanCodeRule: 'Sanitização PII & Tipagem Forte',
    complexityBefore: 4,
    complexityAfter: 1,
    nestingBefore: 2,
    nestingAfter: 1,
    additions: 8,
    deletions: 7,
    hunkHeader: '@@ -1,11 +1,12 @@ // Worker HTTP Inbound Boundary',
    reviewAuthor: 'hexaflow-security-guard',
    reviewNote:
      'Removido console.log com telefone/token (PII), eliminado `any` e desacoplado o cliente Supabase do handler de borda.',
    lines: [
      { type: 'context', oldLine: 1, newLine: 1, code: 'export class WhatsAppWebhookAdapter {' },
      { type: 'remove', oldLine: 2, code: '  async handle(req: Request) {' },
      { type: 'remove', oldLine: 3, code: '    const body: any = await req.json();' },
      { type: 'remove', oldLine: 4, code: '    console.log("Webhook:", body); // vaza PII e token' },
      { type: 'remove', oldLine: 5, code: '    const { data } = await supabase.from("schedules")' },
      { type: 'remove', oldLine: 6, code: '      .insert({ phone: body.from, slot: body.date });' },
      { type: 'remove', oldLine: 7, code: '    return new Response(JSON.stringify(data));' },
      { type: 'remove', oldLine: 8, code: '  }' },
      { type: 'add', newLine: 2, code: '  constructor(private readonly schedulePort: ScheduleSlotPort) {}' },
      { type: 'add', newLine: 3, code: '' },
      { type: 'add', newLine: 4, code: '  async handle(req: Request): Promise<Response> {' },
      { type: 'add', newLine: 5, code: '    const rawPayload = await req.json();' },
      { type: 'add', newLine: 6, code: '    const command = ScheduleCommand.fromSanitizedWebhook(rawPayload);' },
      { type: 'add', newLine: 7, code: '    await this.schedulePort.execute(command);' },
      { type: 'add', newLine: 8, code: '    return Response.json({ accepted: true }, { status: 202 });' },
      { type: 'add', newLine: 9, code: '  }' },
      { type: 'context', oldLine: 9, newLine: 10, code: '}' },
    ],
  },
];

export const PR_CHECKS: PrCheckItem[] = [
  {
    id: 'clean-code',
    name: 'Clean Code & Complexity Gate',
    detail: 'Complexidade ciclomática máxima 2 (limite <= 4) · 0 funções com > 1 nível de aninhamento',
    duration: '4s',
    status: 'passed',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal Boundary Fitness Check',
    detail: '0 importações de infra/SDKs externos no Core Domain · Ports & Adapters respeitados',
    duration: '3s',
    status: 'passed',
  },
  {
    id: 'dry-audit',
    name: 'Auditoria DRY Semântica (N2)',
    detail: '0 blocos duplicados introduzidos · Reuso validado de IdempotencyPort',
    duration: '6s',
    status: 'passed',
  },
  {
    id: 'sandbox-e2e',
    name: 'Sandbox Unit & E2E Contract Suite',
    detail: '22/22 testes unitários e E2E reproduzidos em container efêmero isolado',
    duration: '19s',
    status: 'passed',
  },
  {
    id: 'human-gate',
    name: 'Human-in-the-Loop Change Control',
    detail: 'Auto-merge bloqueado por política corporativa · Requer aprovação do Tech Lead',
    duration: 'policy',
    status: 'enforced',
  },
];

export function getPrFileById(fileId: string): PrFileDiff {
  return PR_DIFF_FILES.find((file) => file.id === fileId) ?? PR_DIFF_FILES[0];
}

export function buildSplitDiffRows(lines: PrDiffLine[]): PrSplitRow[] {
  const rows: PrSplitRow[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = lines[i];

    if (current.type === 'context') {
      rows.push({ left: current, right: current });
      i += 1;
      continue;
    }

    const removes: PrDiffLine[] = [];
    while (i < lines.length && lines[i].type === 'remove') {
      removes.push(lines[i]);
      i += 1;
    }

    const adds: PrDiffLine[] = [];
    while (i < lines.length && lines[i].type === 'add') {
      adds.push(lines[i]);
      i += 1;
    }

    const pairCount = Math.max(removes.length, adds.length);
    for (let p = 0; p < pairCount; p += 1) {
      rows.push({
        left: removes[p] ?? null,
        right: adds[p] ?? null,
      });
    }
  }

  return rows;
}
