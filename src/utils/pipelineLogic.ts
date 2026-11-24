export type ItilTier = 'N1' | 'N2' | 'N3' | 'PR' | 'LOOP';

export interface PipelineLogEntry {
  id: string;
  timestamp: string;
  tier: 'N1' | 'N2' | 'N3';
  stageNumber: number;
  phase: string;
  message: string;
  detail: string;
  slaLabel: string;
  status: 'ok' | 'guardrail' | 'awaiting_human';
}

export interface PipelineScenario {
  id: string;
  ticketCode: string;
  shortLabel: string;
  title: string;
  repository: string;
  branchName: string;
  slaSummary: string;
  blastRadius: string;
  hexagonalLayer: string;
  dryCheck: string;
  testsPassed: string;
  humanApprovalRequired: true;
  prNumber: string;
  diffLines: { type: 'context' | 'remove' | 'add'; code: string }[];
  logs: PipelineLogEntry[];
}

export interface ItilStageSpec {
  number: string;
  tier: ItilTier;
  tierLabel: string;
  title: string;
  subtitle: string;
  description: string;
  inputArtifact: string;
  guardrail: string;
  outputArtifact: string;
}

export interface PlanOption {
  id: 'poc' | 'core' | 'governance';
  name: string;
  audience: string;
  cadence: string;
  summary: string;
  deliverables: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

export interface DiagnosticFormValues {
  name: string;
  email: string;
  companyAndRole: string;
  teamAndStack: string;
  planId: 'poc' | 'core' | 'governance';
  bottleneck: string;
}

export type DiagnosticFormErrors = Partial<Record<keyof DiagnosticFormValues, string>>;

export type FaqCategory = 'Arquitetura Hexagonal' | 'Governança ITIL' | 'Segurança & Sandbox';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  guardrailNote: string;
}

export type CodeTransformationTier = 'N1' | 'N2' | 'N3';

export interface CodeTransformationStage {
  tier: CodeTransformationTier;
  tabLabel: string;
  stageTitle: string;
  summary: string;
  beforeFile: string;
  beforeIssue: string;
  beforeCode: string[];
  afterFile: string;
  afterPattern: string;
  afterCode: string[];
  principles: string[];
}

export const PIPELINE_SCENARIOS: PipelineScenario[] = [
  {
    id: 'aeepet-calendar-sync',
    ticketCode: 'OPS-422',
    shortLabel: 'OPS-422 · AEEPET',
    title: 'Falha intermitente de sincronismo WhatsApp + Google Calendar',
    repository: 'aeepet/ops-management-saas',
    branchName: 'fix/n3-ops422-calendar-idempotency-port',
    slaSummary: 'SLA P2 · 14m decorridos',
    blastRadius: '1 Port · 1 Worker Adapter (2 arquivos)',
    hexagonalLayer: 'Application Port + Cloudflare Worker Adapter',
    dryCheck: 'Auditoria DRY: 0 duplicações · Reuso de IdempotencyPolicy',
    testsPassed: '22/22 unitários + E2E em sandbox',
    humanApprovalRequired: true,
    prNumber: 'PR #1084',
    diffLines: [
      { type: 'context', code: '  async dispatchSlot(cmd: SyncCalendarCommand): Promise<void> {' },
      { type: 'remove', code: '-   await this.calendarPort.upsertEvent(cmd.sessionId, cmd.slot);' },
      { type: 'add', code: '+   await this.idempotencyPort.runOnce(cmd.webhookEventId, async () => {' },
      { type: 'add', code: '+     await this.calendarPort.upsertEvent(cmd.sessionId, cmd.slot);' },
      { type: 'add', code: '+   });' },
      { type: 'context', code: '  }' },
    ],
    logs: [
      {
        id: 'a-1',
        timestamp: '09:14:02',
        tier: 'N1',
        stageNumber: 1,
        phase: 'Triagem Técnica & SLA',
        message: 'Chamado OPS-422 classificado com SLA P2 e correlacionado ao Worker + Supabase.',
        detail: 'Contexto sanitizado sem PII · Fila corporativa priorizada automaticamente.',
        slaLabel: 'SLA N1: 18s',
        status: 'ok',
      },
      {
        id: 'a-2',
        timestamp: '09:14:38',
        tier: 'N2',
        stageNumber: 2,
        phase: 'RCA, Blast Radius & Auditoria DRY',
        message: 'Causa raiz isolada no webhook de agenda; 0 código duplicado necessário.',
        detail: 'Blast radius contido a CalendarSyncUseCase e CloudflareWebhookAdapter.',
        slaLabel: 'RCA N2: 36s',
        status: 'guardrail',
      },
      {
        id: 'a-3',
        timestamp: '09:15:19',
        tier: 'N2',
        stageNumber: 3,
        phase: 'Reprodução Determinística em Sandbox',
        message: 'Retentativa dupla WhatsApp→Calendar reproduzida em sandbox isolado.',
        detail: 'Teste de contrato falhou antes do patch, comprovando a race condition.',
        slaLabel: 'Sandbox OK',
        status: 'ok',
      },
      {
        id: 'a-4',
        timestamp: '09:16:04',
        tier: 'N3',
        stageNumber: 4,
        phase: 'Implementação Hexagonal & Testes E2E',
        message: 'Reutilizado IdempotencyPort canônico; 22/22 testes unitários e E2E verdes.',
        detail: 'Clean Code verificado · Zero acoplamento de infraestrutura no Core Domain.',
        slaLabel: '22/22 Passou',
        status: 'guardrail',
      },
      {
        id: 'a-5',
        timestamp: '09:16:28',
        tier: 'N3',
        stageNumber: 5,
        phase: 'PR Pronto · Human-in-the-Loop',
        message: 'PR #1084 aberto com laudo de RCA e memória arquitetural atualizada.',
        detail: 'Auto-merge bloqueado por política B2B. Aguardando aprovação do Tech Lead.',
        slaLabel: 'Revisão Humana',
        status: 'awaiting_human',
      },
    ],
  },
  {
    id: 'supabase-rls-timeout',
    ticketCode: 'OPS-418',
    shortLabel: 'OPS-418 · Supabase',
    title: 'Timeout na conciliação de repasses em lote via Edge Adapter',
    repository: 'finops/ledger-core-api',
    branchName: 'fix/n3-ops418-batch-cursor-adapter',
    slaSummary: 'SLA P1 · 11m decorridos',
    blastRadius: '1 Outbound Adapter (1 arquivo + 2 specs)',
    hexagonalLayer: 'Supabase Persistence Adapter',
    dryCheck: 'Auditoria DRY: Reuso de PaginatedCursorPolicy',
    testsPassed: '28/28 testes + E2E em sandbox',
    humanApprovalRequired: true,
    prNumber: 'PR #892',
    diffLines: [
      { type: 'context', code: '  export class LedgerBatchAdapter implements SettlementPort {' },
      { type: 'remove', code: '-   return this.db.from("entries").select("*").eq("cycle", cycleId);' },
      { type: 'add', code: '+   return this.cursorPolicy.streamByKeyset(' },
      { type: 'add', code: '+     (cursor) => this.db.fetchCyclePage(cycleId, cursor, 250)' },
      { type: 'add', code: '+   );' },
      { type: 'context', code: '  }' },
    ],
    logs: [
      {
        id: 'p-1',
        timestamp: '11:02:10',
        tier: 'N1',
        stageNumber: 1,
        phase: 'Triagem Técnica & SLA',
        message: '14 alertas HTTP 504 consolidados no chamado corporativo OPS-418.',
        detail: 'SLA P1 acionado · Fila financeira isolada para atendimento prioritário.',
        slaLabel: 'SLA N1: 12s',
        status: 'ok',
      },
      {
        id: 'p-2',
        timestamp: '11:02:44',
        tier: 'N2',
        stageNumber: 2,
        phase: 'RCA, Blast Radius & Auditoria DRY',
        message: 'Full-scan detectado no adaptador Supabase; PaginatedCursorPolicy localizada.',
        detail: 'Regras de cálculo financeiro no Core Domain permanecem intocadas.',
        slaLabel: 'RCA N2: 34s',
        status: 'guardrail',
      },
      {
        id: 'p-3',
        timestamp: '11:03:20',
        tier: 'N2',
        stageNumber: 3,
        phase: 'Reprodução Determinística em Sandbox',
        message: 'Massa sintética de 18 mil registros reproduziu timeout em 5.1s no sandbox.',
        detail: 'Baseline de latência e memória registrado no dossiê N2.',
        slaLabel: 'Sandbox OK',
        status: 'ok',
      },
      {
        id: 'p-4',
        timestamp: '11:03:58',
        tier: 'N3',
        stageNumber: 4,
        phase: 'Implementação Hexagonal & Testes E2E',
        message: 'Keyset pagination aplicada via policy compartilhada; latência caiu para 180ms.',
        detail: '28/28 testes aprovados · Lint arquitetural sem violações.',
        slaLabel: '28/28 Passou',
        status: 'guardrail',
      },
      {
        id: 'p-5',
        timestamp: '11:04:19',
        tier: 'N3',
        stageNumber: 5,
        phase: 'PR Pronto · Human-in-the-Loop',
        message: 'PR #892 pronto para code review com comparativo de performance anexo.',
        detail: 'Merge automático proibido. Aguardando sign-off da liderança técnica.',
        slaLabel: 'Revisão Humana',
        status: 'awaiting_human',
      },
    ],
  },
  {
    id: 'worker-auth-regression',
    ticketCode: 'OPS-431',
    shortLabel: 'OPS-431 · Workers',
    title: 'Expiração prematura de assinatura HMAC em Cloudflare Worker',
    repository: 'platform/edge-gateway',
    branchName: 'fix/n3-ops431-hmac-clock-skew-vo',
    slaSummary: 'SLA P2 · 9m decorridos',
    blastRadius: '1 Value Object · 1 Guard Spec',
    hexagonalLayer: 'Domain Security Value Object',
    dryCheck: 'Auditoria DRY: Unificado em SignedTimestampVO',
    testsPassed: '31/31 testes de contrato',
    humanApprovalRequired: true,
    prNumber: 'PR #647',
    diffLines: [
      { type: 'context', code: '  isWithinTolerance(receivedAtEpoch: number, nowEpoch: number): boolean {' },
      { type: 'remove', code: '-   return nowEpoch - receivedAtEpoch <= this.windowSeconds;' },
      { type: 'add', code: '+   return Math.abs(nowEpoch - receivedAtEpoch) <= this.windowSeconds;' },
      { type: 'context', code: '  }' },
    ],
    logs: [
      {
        id: 'f-1',
        timestamp: '14:40:05',
        tier: 'N1',
        stageNumber: 1,
        phase: 'Triagem Técnica & SLA',
        message: 'Ticket OPS-431 triado com assinatura de clock-skew entre regiões edge.',
        detail: 'SLA P2 dentro da meta · Segredos HMAC mantidos fora do contexto.',
        slaLabel: 'SLA N1: 15s',
        status: 'ok',
      },
      {
        id: 'f-2',
        timestamp: '14:40:31',
        tier: 'N2',
        stageNumber: 2,
        phase: 'RCA, Blast Radius & Auditoria DRY',
        message: 'Blast radius restrito ao Value Object SignedTimestampVO no domínio.',
        detail: 'Validação DRY evitou criar helper paralelo no adapter do Worker.',
        slaLabel: 'RCA N2: 26s',
        status: 'guardrail',
      },
      {
        id: 'f-3',
        timestamp: '14:41:05',
        tier: 'N2',
        stageNumber: 3,
        phase: 'Reprodução Determinística em Sandbox',
        message: 'Drift negativo de -2s simulado em sandbox reproduziu HTTP 401 indevido.',
        detail: 'Causa raiz confirmada com prova determinística.',
        slaLabel: 'Sandbox OK',
        status: 'ok',
      },
      {
        id: 'f-4',
        timestamp: '14:41:37',
        tier: 'N3',
        stageNumber: 4,
        phase: 'Implementação Hexagonal & Testes E2E',
        message: 'Patch mínimo aplicado com cobertura completa de borda temporal.',
        detail: '31/31 testes aprovados em ambiente isolado.',
        slaLabel: '31/31 Passou',
        status: 'guardrail',
      },
      {
        id: 'f-5',
        timestamp: '14:41:59',
        tier: 'N3',
        stageNumber: 5,
        phase: 'PR Pronto · Human-in-the-Loop',
        message: 'PR #647 vinculado ao ticket ITIL OPS-431 e pronto para revisão.',
        detail: 'Zero auto-merge. Padrão gravado na memória arquitetural do repositório.',
        slaLabel: 'Revisão Humana',
        status: 'awaiting_human',
      },
    ],
  },
];

export const ITIL_STAGES: ItilStageSpec[] = [
  {
    number: '01',
    tier: 'N1',
    tierLabel: 'N1 · Triagem',
    title: 'Triagem Técnica & SLA',
    subtitle: 'Ingestão corporativa da fila de chamados e priorização determinística',
    description:
      'Recebe chamados de sustentação, bugs e incidentes operacionais diretamente da fila da empresa, classifica severidade e SLA sob critérios ITIL, remove ruído e sanitiza PII antes de qualquer análise.',
    inputArtifact: 'Fila de tickets (Jira/Linear/Zendesk) + Logs & Traces',
    guardrail: 'Controle de SLA por severidade e sanitização estrita de dados sensíveis',
    outputArtifact: 'Ticket N1 normalizado com contexto reproduzível',
  },
  {
    number: '02',
    tier: 'N2',
    tierLabel: 'N2 · RCA & DRY',
    title: 'Causa Raiz (RCA), Blast Radius & DRY',
    subtitle: 'Diagnóstico arquitetural antes de alterar qualquer linha',
    description:
      'Mapeia o grafo de dependências do sistema, delimita o Blast Radius máximo permitido, comprova a causa raiz (RCA) e executa auditoria DRY para reutilizar Ports, Policies e Value Objects já existentes.',
    inputArtifact: 'Dossiê N1 + Grafo AST e mapa de Ports & Adapters',
    guardrail: 'Auditoria DRY obrigatória e contenção de Blast Radius por camada',
    outputArtifact: 'Laudo técnico de RCA + Plano cirúrgico de intervenção',
  },
  {
    number: '03',
    tier: 'N3',
    tierLabel: 'N3 · Sandbox',
    title: 'Implementação & Guardrails em Sandbox',
    subtitle: 'Arquitetura Hexagonal, Clean Code e suíte de testes verde',
    description:
      'Executa em container sandboxed efêmero, escreve o teste que reproduz a falha, implementa a correção respeitando rigorosamente Arquitetura Hexagonal e Clean Code e valida testes unitários, contrato e E2E.',
    inputArtifact: 'Plano N2 + Ambiente efêmero sandboxed isolado',
    guardrail: 'Isolamento de segredos, linters arquiteturais e 100% dos testes passando',
    outputArtifact: 'Patch validado com evidência completa de testes em sandbox',
  },
  {
    number: '04',
    tier: 'PR',
    tierLabel: 'Solução · PR',
    title: 'Pull Request Pronto para Aprovação',
    subtitle: 'Human-in-the-Loop rigoroso — zero merge automático',
    description:
      'Abre um Pull Request enxuto e auditável com laudo de RCA, mapa de arquivos afetados e logs dos testes. O HexaFlow nunca realiza merge automático: a decisão final pertence sempre ao Tech Lead ou Arquiteto.',
    inputArtifact: 'Patch validado N3 + Relatório de conformidade',
    guardrail: 'Human-in-the-Loop obrigatório (auto-merge bloqueado por arquitetura)',
    outputArtifact: 'PR rastreável pronto para code review em minutos',
  },
  {
    number: '05',
    tier: 'LOOP',
    tierLabel: 'Feedback Loop',
    title: 'Memória Arquitetural Proprietária',
    subtitle: 'Aprendizado contínuo com os feedbacks do seu time',
    description:
      'Cada comentário de revisão humana e decisão arquitetural aprovada alimenta a memória proprietária da empresa no HexaFlow, tornando os próximos PRs ainda mais aderentes às convenções do seu time.',
    inputArtifact: 'Revisões de PR + Decisões de arquitetura (ADRs)',
    guardrail: 'Memória isolada por tenant corporativo (sem treinamento cruzado)',
    outputArtifact: 'Base viva de padrões que reduz retrabalho a cada sprint',
  },
];

export const COMPARISON_ROWS = [
  {
    criterion: 'Escopo de Atuação',
    generic: 'Licença individual no editor do dev; não gerencia fila corporativa, SLA ou backlog operacional.',
    hexaflow: 'Infraestrutura B2B de Autonomous Engineering Ops conectada à fila de tickets e processo da empresa.',
  },
  {
    criterion: 'Arquitetura',
    generic: 'Edita arquivos oportunisticamente; vaza regra de negócio para controllers, workers ou adapters.',
    hexaflow: 'Respeita Arquitetura Hexagonal (Ports & Adapters) rigorosamente, mantendo o Core Domain blindado.',
  },
  {
    criterion: 'Dívida Técnica (DRY)',
    generic: 'Gera código duplicado e helpers descartáveis a cada prompt, elevando o custo de manutenção.',
    hexaflow: 'Auditoria DRY nativa que localiza e reutiliza abstrações, policies e contratos canônicos do projeto.',
  },
  {
    criterion: 'Governança ITIL',
    generic: 'Sem vínculo entre triagem N1, causa raiz N2 e entrega N3; difícil auditar em compliance.',
    hexaflow: 'Rastreabilidade completa N1 → N2 → N3 → Pull Request → Feedback Loop com trilha auditável.',
  },
  {
    criterion: 'Segurança em Produção',
    generic: 'Sem contenção de Blast Radius ou sandbox determinístico; risco elevado de regressões silenciosas.',
    hexaflow: 'Execução sandboxed, validação de testes E2E/contrato e Human-in-the-Loop obrigatório (zero auto-merge).',
  },
];

export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: 'poc',
    name: 'PoC de Velocidade',
    audience: 'Validação executiva de ROI no seu código real',
    cadence: '2 Semanas',
    summary:
      'Implantação focada em um repositório crítico para atacar incidentes N1/N2 reais, comprovar aderência hexagonal e medir ganho de capacidade sênior.',
    deliverables: [
      'Conexão a 1 repositório e fila corporativa de tickets',
      'Mapeamento inicial de Ports & Adapters e Blast Radius',
      'Processamento de incidentes reais N1 → N2 → N3 até PR',
      'Relatório executivo de redução de tempo de triagem e RCA',
    ],
    ctaLabel: 'Solicitar PoC de 2 Semanas',
  },
  {
    id: 'core',
    name: 'Esteira HexaFlow Core',
    audience: 'Para empresas escalando sustentação e evolução',
    cadence: '3 a 4 Semanas',
    summary:
      'Implantação completa da célula autônoma B2B com esteira ITIL ponta a ponta, guardrails DRY/Clean Code customizados e memória arquitetural proprietária.',
    deliverables: [
      'Esteira ITIL completa (N1 → N2 → N3 → PR → Feedback Loop)',
      'Guardrails customizados para Hexagonal, DRY e testes E2E',
      'Integração corporativa com Jira/Linear, GitHub/GitLab e logs',
      'Memória arquitetural dedicada às convenções do time',
    ],
    ctaLabel: 'Implantar HexaFlow Core',
    highlighted: true,
  },
  {
    id: 'governance',
    name: 'Governança & Escala',
    audience: 'Para múltiplos squads e requisitos enterprise',
    cadence: 'Recorrência Mensal',
    summary:
      'Operação contínua multi-repositório com governança estendida, runners isolados, auditoria de dívida técnica e evolução assistida da arquitetura.',
    deliverables: [
      'Cobertura multi-repositório com isolamento por domínio',
      'Sandboxes dedicados na infraestrutura corporativa',
      'Auditorias recorrentes de conformidade DRY e Clean Code',
      'SLA prioritário e acompanhamento direto de arquitetos',
    ],
    ctaLabel: 'Estruturar Escala Mensal',
  },
];

export function getScenarioById(id: string): PipelineScenario {
  return PIPELINE_SCENARIOS.find((s) => s.id === id) ?? PIPELINE_SCENARIOS[0];
}

export function getVisibleLogs(scenario: PipelineScenario, stepCount: number): PipelineLogEntry[] {
  const clamped = Math.max(1, Math.min(stepCount, scenario.logs.length));
  return scenario.logs.slice(0, clamped);
}

export function getStageProgressPercent(stepCount: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  const clamped = Math.max(0, Math.min(stepCount, totalSteps));
  return Math.round((clamped / totalSteps) * 100);
}

export function validateDiagnosticForm(values: DiagnosticFormValues): {
  valid: boolean;
  errors: DiagnosticFormErrors;
  sanitized: DiagnosticFormValues;
} {
  const sanitized: DiagnosticFormValues = {
    name: values.name.trim(),
    email: values.email.trim(),
    companyAndRole: values.companyAndRole.trim(),
    teamAndStack: values.teamAndStack.trim(),
    planId: values.planId,
    bottleneck: values.bottleneck.trim(),
  };

  const errors: DiagnosticFormErrors = {};

  if (sanitized.name.length < 2) {
    errors.name = 'Informe seu nome completo.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(sanitized.email)) {
    errors.email = 'Informe um e-mail corporativo válido.';
  }

  if (sanitized.companyAndRole.length < 3) {
    errors.companyAndRole = 'Informe empresa e cargo (ex.: CTO na Acme).';
  }

  if (sanitized.teamAndStack.length < 3) {
    errors.teamAndStack = 'Informe o tamanho do time e a stack principal.';
  }

  if (sanitized.bottleneck.length < 10) {
    errors.bottleneck = 'Descreva brevemente o principal gargalo operacional (mín. 10 caracteres).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'hexagonal-boundaries',
    category: 'Arquitetura Hexagonal',
    question: 'Como o HexaFlow impede que a IA viole as fronteiras entre Domain, Ports e Adapters?',
    answer:
      'Na fase N2, a esteira constrói o grafo AST e mapeia os contratos explícitos de entrada e saída (Inbound/Outbound Ports). Durante o estágio N3, validadores arquiteturais automatizados bloqueiam qualquer importação direta de SDKs externos, banco de dados (ex.: Supabase) ou camadas HTTP/Workers dentro do Core Domain antes da abertura do Pull Request.',
    guardrailNote: 'Guardrail ativo: Dependency Fitness Check + Isolamento estrito de Ports & Adapters',
  },
  {
    id: 'zero-auto-merge',
    category: 'Governança ITIL',
    question: 'Por que o HexaFlow opera com zero auto-merge e como funciona o Human-in-the-Loop?',
    answer:
      'Sob governança ITIL de Change Control, alterações autônomas nunca são aplicadas diretamente na branch principal. A esteira entrega o Pull Request enxuto acompanhado do laudo de RCA (N2), mapa de Blast Radius, auditoria DRY e evidência dos testes em sandbox, cabendo exclusivamente ao Tech Lead ou Arquiteto aprovar o merge.',
    guardrailNote: 'Guardrail ativo: Auto-merge bloqueado por política corporativa em todos os repositórios',
  },
  {
    id: 'sandbox-pii-isolation',
    category: 'Segurança & Sandbox',
    question: 'Como segredos, credenciais de produção e dados sensíveis (PII) são protegidos na esteira?',
    answer:
      'Na triagem N1, payloads de chamados e logs passam por sanitização automática de PII e tokens antes de qualquer inferência. A reprodução da falha (N2) e a validação de patch (N3) executam em containers sandboxed efêmeros e isolados da rede de produção, usando dados sintéticos e sem exposição de variáveis sensíveis ou treinamento cruzado de modelos.',
    guardrailNote: 'Guardrail ativo: Sanitização N1 de PII + Runners sandboxed efêmeros sem segredos reais',
  },
  {
    id: 'dry-audit-prevention',
    category: 'Arquitetura Hexagonal',
    question: 'Como a auditoria DRY evita a proliferação de código duplicado e helpers descartáveis?',
    answer:
      'Antes de escrever qualquer linha de código no N3, o estágio N2 executa uma varredura semântica e estrutural no repositório para localizar Policies, Value Objects, Ports e utilitários canônicos já existentes. O plano de correção exige reuso explícito desses componentes e reprova patches que introduzam lógica redundante.',
    guardrailNote: 'Guardrail ativo: Auditoria DRY obrigatória no estágio N2 antes da geração de patch N3',
  },
  {
    id: 'blast-radius-p1-p2',
    category: 'Governança ITIL',
    question: 'O que acontece quando um incidente P1/P2 exige alteração ampla ou ultrapassa o Blast Radius?',
    answer:
      'Cada ticket recebe um limite explícito de Blast Radius calculado na análise N2. Se o diagnóstico identificar que a correção exige refatoração estrutural fora da camada segura ou não houver cobertura de testes de contrato/E2E suficiente, o HexaFlow interrompe a geração automática e entrega o dossiê completo de RCA para decisão imediata do time sênior.',
    guardrailNote: 'Guardrail ativo: Contenção de Blast Radius + Escalonamento determinístico para liderança',
  },
  {
    id: 'itil-stack-integration',
    category: 'Segurança & Sandbox',
    question: 'Precisamos migrar de ferramentas de tickets ou refatorar o legado para implantar o HexaFlow?',
    answer:
      'Não. O HexaFlow conecta-se em paralelo à operação existente via conectores com escopo mínimo (Jira, Linear, Zendesk, GitHub/GitLab, logs/traces e runners CI). Em sistemas legados ou híbridos, as regras hexagonais podem ser aplicadas incrementalmente por módulo crítico — começando por integrações externas como WhatsApp, Google Calendar, Supabase e Workers.',
    guardrailNote: 'Guardrail ativo: Conectores least-privilege + Adoção incremental sem reescrita de legado',
  },
];

export function toggleFaqId(openIds: string[], targetId: string): string[] {
  if (openIds.includes(targetId)) {
    return openIds.filter((id) => id !== targetId);
  }
  return [...openIds, targetId];
}

export const CODE_TRANSFORMATIONS: CodeTransformationStage[] = [
  {
    tier: 'N1',
    tabLabel: 'N1 · Triagem',
    stageTitle: 'Sanitização de Entrada & Separação de Inbound Adapter',
    summary:
      'Na etapa N1, o HexaFlow isola o payload externo (webhook WhatsApp) em um Inbound Adapter tipado, removendo PII e impedindo que o handler HTTP acesse o Supabase ou regras de domínio diretamente.',
    beforeFile: 'workers/whatsapp-webhook.ts',
    beforeIssue: 'Acoplamento HTTP + Banco + PII exposta',
    beforeCode: [
      'export async function handleWebhook(req: Request) {',
      '  const body: any = await req.json();',
      '  console.log("Payload:", body); // vaza telefone e token',
      '  const { data } = await supabase',
      '    .from("schedules")',
      '    .insert({ phone: body.from, slot: body.date });',
      '  return new Response(JSON.stringify(data));',
      '}',
    ],
    afterFile: 'adapters/inbound/WhatsAppWebhookAdapter.ts',
    afterPattern: 'Inbound Adapter -> Input Port DTO',
    afterCode: [
      'export class WhatsAppWebhookAdapter {',
      '  constructor(private readonly port: ScheduleSlotPort) {}',
      '',
      '  async handle(req: Request): Promise<Response> {',
      '    const cmd = ScheduleCommand.fromSanitizedWebhook(',
      '      await req.json()',
      '    );',
      '    await this.port.execute(cmd);',
      '    return Response.json({ accepted: true }, { status: 202 });',
      '  }',
      '}',
    ],
    principles: [
      'Sanitização de PII na fronteira N1',
      'Inbound Adapter sem regra de negócio',
      'Contrato explícito via Input Port',
    ],
  },
  {
    tier: 'N2',
    tabLabel: 'N2 · RCA & DRY',
    stageTitle: 'Auditoria DRY & Inversão de Dependência por Port',
    summary:
      'Na etapa N2, o diagnóstico de causa raiz (RCA) identifica lógica duplicada de retentativa e substitui chamadas ad-hoc pelo Port canônico de idempotência já existente no projeto.',
    beforeFile: 'services/calendar-sync-helper.ts',
    beforeIssue: 'Lógica duplicada + Race condition',
    beforeCode: [
      'export async function syncCalendar(id: string, slot: string) {',
      '  try {',
      '    await fetch("https://www.googleapis.com/calendar/v3/...", {',
      '      method: "POST",',
      '      body: JSON.stringify({ id, slot }),',
      '    });',
      '  } catch (err) {',
      '    // retry manual duplicado em 3 arquivos diferentes',
      '    await new Promise((r) => setTimeout(r, 400));',
      '    await fetch("https://www.googleapis.com/calendar/v3/...");',
      '  }',
      '}',
    ],
    afterFile: 'application/use-cases/SyncCalendarUseCase.ts',
    afterPattern: 'Auditoria DRY · Reuso de IdempotencyPort',
    afterCode: [
      'export class SyncCalendarUseCase implements ScheduleSlotPort {',
      '  constructor(',
      '    private readonly calendar: CalendarGatewayPort,',
      '    private readonly idempotency: IdempotencyPort',
      '  ) {}',
      '',
      '  async execute(cmd: ScheduleCommand): Promise<void> {',
      '    await this.idempotency.runOnce(cmd.eventKey, () =>',
      '      this.calendar.upsertAppointment(cmd.slot)',
      '    );',
      '  }',
      '}',
    ],
    principles: [
      'Zero código duplicado (DRY)',
      'Blast Radius contido em 1 Use Case',
      'Inversão de dependência via Outbound Ports',
    ],
  },
  {
    tier: 'N3',
    tabLabel: 'N3 · Sandbox',
    stageTitle: 'Clean Code, Pure Core Domain & Testes Determinísticos',
    summary:
      'Na etapa N3 em sandbox efêmero, o domínio aplica early returns legíveis, injeta relógio/repositório via Ports e valida toda a suíte unitária e E2E antes de abrir o PR para revisão humana.',
    beforeFile: 'legacy/confirm-appointment.ts',
    beforeIssue: 'Estado implícito + Não testável',
    beforeCode: [
      'export async function confirm(slot: any) {',
      '  if (slot) {',
      '    if (slot.status !== "CANCELLED") {',
      '      if (new Date(slot.startsAt) > new Date()) {',
      '        await db.query("UPDATE slots SET ok=1", [slot.id]);',
      '        return true;',
      '      }',
      '    }',
      '  }',
      '  return false;',
      '}',
    ],
    afterFile: 'domain/entities/AppointmentSlot.ts',
    afterPattern: 'Pure Domain + Early Return + ClockPort',
    afterCode: [
      'export class AppointmentSlot {',
      '  confirm(nowUtc: Instant): DomainResult<SlotConfirmed> {',
      '    if (this.status === "CANCELLED") {',
      '      return DomainResult.fail("SLOT_CANCELLED");',
      '    }',
      '    if (!this.startsAt.isAfter(nowUtc)) {',
      '      return DomainResult.fail("SLOT_EXPIRED");',
      '    }',
      '    this.status = "CONFIRMED";',
      '    return DomainResult.ok(new SlotConfirmed(this.id));',
      '  }',
      '}',
    ],
    principles: [
      'Clean Code com Early Returns',
      'Core Domain 100% isolado de SQL/SDKs',
      'Testes determinísticos + E2E em sandbox',
    ],
  },
];

export function getCodeTransformationByTier(tier: CodeTransformationTier): CodeTransformationStage {
  return CODE_TRANSFORMATIONS.find((item) => item.tier === tier) ?? CODE_TRANSFORMATIONS[0];
}

export type GlossaryTermKey =
  | 'itil'
  | 'hexagonal'
  | 'ports_adapters'
  | 'dry'
  | 'clean_code'
  | 'rca'
  | 'blast_radius'
  | 'human_in_the_loop'
  | 'sandbox'
  | 'sla'
  | 'e2e'
  | 'ast'
  | 'pii'
  | 'core_domain'
  | 'value_object'
  | 'inbound_adapter'
  | 'outbound_ports'
  | 'early_return'
  | 'supabase'
  | 'workers';

export interface GlossaryEntry {
  key: GlossaryTermKey;
  term: string;
  category: string;
  summary: string;
  impact: string;
}

export const TECHNICAL_GLOSSARY: Record<GlossaryTermKey, GlossaryEntry> = {
  itil: {
    key: 'itil',
    term: 'Governança ITIL (N1 → N2 → N3)',
    category: 'Gestão Operacional',
    summary:
      'Framework corporativo que organiza chamados em níveis progressivos: N1 (triagem e SLA), N2 (investigação de causa raiz) e N3 (engenharia de correção e testes).',
    impact: 'Garante rastreabilidade ponta a ponta entre o ticket aberto e o Pull Request entregue.',
  },
  hexagonal: {
    key: 'hexagonal',
    term: 'Arquitetura Hexagonal',
    category: 'Arquitetura de Software',
    summary:
      'Modelo estrutural que isola as regras de negócio (Core Domain) no centro da aplicação, comunicando-se com o mundo externo apenas por contratos bem definidos.',
    impact: 'Impede que mudanças em APIs, bancos ou filas quebrem a lógica principal da empresa.',
  },
  ports_adapters: {
    key: 'ports_adapters',
    term: 'Ports & Adapters',
    category: 'Arquitetura Hexagonal',
    summary:
      'Ports são interfaces abstratas de entrada/saída; Adapters são as implementações concretas que conectam o domínio a serviços externos como Supabase, WhatsApp ou HTTP.',
    impact: 'Bloqueia importações diretas de SDKs externos dentro do domínio durante a fase N3.',
  },
  dry: {
    key: 'dry',
    term: "DRY (Don't Repeat Yourself)",
    category: 'Qualidade & Dívida Técnica',
    summary:
      'Princípio que exige que cada regra ou política exista em uma única fonte canônica de verdade, evitando trechos duplicados espalhados pelo repositório.',
    impact: 'Auditoria automática na etapa N2 reaproveita Policies existentes antes de gerar código.',
  },
  clean_code: {
    key: 'clean_code',
    term: 'Clean Code',
    category: 'Engenharia de Código',
    summary:
      'Conjunto de práticas para escrever código claro, modular e previsível — com funções coesas, nomes explícitos e baixa complexidade ciclomática.',
    impact: 'Reduz o tempo de code review humano e facilita manutenção futura pelo time interno.',
  },
  rca: {
    key: 'rca',
    term: 'RCA (Root Cause Analysis)',
    category: 'Diagnóstico N2',
    summary:
      'Análise técnica que comprova a origem exata de um bug ou incidente antes de propor qualquer alteração de código.',
    impact: 'Todo PR do HexaFlow nasce acompanhado do laudo de RCA reproduzido em sandbox.',
  },
  blast_radius: {
    key: 'blast_radius',
    term: 'Blast Radius',
    category: 'Segurança de Mudança',
    summary:
      'Escopo máximo de arquivos, módulos ou serviços que uma alteração pode afetar caso algo dê errado.',
    impact: 'Contido na etapa N2 para impedir que um bug simples vire uma refatoração arriscada.',
  },
  human_in_the_loop: {
    key: 'human_in_the_loop',
    term: 'Human-in-the-Loop',
    category: 'Controle Corporativo',
    summary:
      'Modelo em que a automação prepara diagnóstico, patch e testes, mas a decisão final de aprovar e aplicar em produção é sempre humana.',
    impact: 'Zero merge automático: apenas Tech Leads ou Arquitetos aprovam o Pull Request.',
  },
  sandbox: {
    key: 'sandbox',
    term: 'Execução Sandboxed',
    category: 'Segurança & Isolamento',
    summary:
      'Container efêmero e isolado da rede e do banco de produção onde a falha é reproduzida e os testes rodam com segurança.',
    impact: 'Protege segredos corporativos e garante que nenhum comando afete clientes reais.',
  },
  sla: {
    key: 'sla',
    term: 'SLA (Service Level Agreement)',
    category: 'Operação ITIL',
    summary:
      'Acordo de nível de serviço que define prazos máximos de resposta e resolução conforme a severidade (P1, P2) do chamado.',
    impact: 'Triagem N1 automatizada prioriza a fila em segundos dentro da janela acordada.',
  },
  e2e: {
    key: 'e2e',
    term: 'Testes E2E (End-to-End)',
    category: 'Validação Contínua',
    summary:
      'Testes que validam o fluxo completo de ponta a ponta — da entrada do evento até a persistência e integração externa.',
    impact: 'Nenhum PR é aberto sem comprovar que a jornada crítica passa integralmente.',
  },
  ast: {
    key: 'ast',
    term: 'Grafo AST (Abstract Syntax Tree)',
    category: 'Análise Estática',
    summary:
      'Representação estrutural em árvore do código-fonte usada para mapear dependências exatas entre classes, funções e camadas.',
    impact: 'Permite verificar fronteiras hexagonais e localizar duplicações sem achismos.',
  },
  pii: {
    key: 'pii',
    term: 'PII (Dados Pessoais Sensíveis)',
    category: 'Privacidade & Compliance',
    summary:
      'Informações que identificam pessoas físicas (CPF, telefone, e-mail, tokens) presentes em logs e payloads operacionais.',
    impact: 'Mascaradas automaticamente na triagem N1 antes de entrar na esteira de análise.',
  },
  core_domain: {
    key: 'core_domain',
    term: 'Core Domain',
    category: 'Arquitetura Hexagonal',
    summary:
      'Núcleo central que concentra as regras de negócio exclusivas e de maior valor estratégico da empresa.',
    impact: 'Permanece 100% blindado contra acoplamento com bancos, frameworks ou APIs.',
  },
  value_object: {
    key: 'value_object',
    term: 'Value Object',
    category: 'Domain-Driven Design',
    summary:
      'Objeto imutável definido pelo seu valor (como janela de tempo ou assinatura HMAC) que garante invariantes de validação em um único lugar.',
    impact: 'Evita validações repetidas e inconsistentes espalhadas por controllers e helpers.',
  },
  inbound_adapter: {
    key: 'inbound_adapter',
    term: 'Inbound Adapter',
    category: 'Arquitetura Hexagonal',
    summary:
      'Camada de entrada que recebe requisições externas (HTTP, webhooks, filas) e as converte em comandos tipados para a aplicação.',
    impact: 'Mantém detalhes de protocolo e headers fora dos casos de uso do negócio.',
  },
  outbound_ports: {
    key: 'outbound_ports',
    term: 'Outbound Ports',
    category: 'Arquitetura Hexagonal',
    summary:
      'Interfaces declaradas pela aplicação para consumir recursos externos (bancos, calendários, mensageria) sem depender da implementação concreta.',
    impact: 'Permite testar casos de uso em sandbox com substitutos determinísticos.',
  },
  early_return: {
    key: 'early_return',
    term: 'Early Return',
    category: 'Clean Code',
    summary:
      'Padrão de fluxo que valida e retorna casos de erro ou borda no início da função, eliminando múltiplos níveis de `if` aninhados.',
    impact: 'Torna regras críticas fáceis de ler e auditar durante a revisão do Pull Request.',
  },
  supabase: {
    key: 'supabase',
    term: 'Supabase',
    category: 'Infraestrutura de Dados',
    summary:
      'Plataforma Postgres gerenciada com autenticação, RLS e APIs — tratada no HexaFlow estritamente como um Outbound Adapter de persistência.',
    impact: 'Queries e políticas ficam encapsuladas fora do núcleo de regras da empresa.',
  },
  workers: {
    key: 'workers',
    term: 'Cloudflare Workers',
    category: 'Edge Runtime',
    summary:
      'Execução serverless distribuída na borda para webhooks e APIs de baixa latência, isolada como camada de entrada/adaptação.',
    impact: 'Eventos de edge são sanitizados em N1 e roteados com segurança para os Ports.',
  },
};

const GLOSSARY_PATTERNS: Array<{ regex: RegExp; key: GlossaryTermKey }> = [
  { regex: /\bPorts\s*&\s*Adapters\b/i, key: 'ports_adapters' },
  { regex: /\bArquitetura Hexagonal\b/i, key: 'hexagonal' },
  { regex: /\bHuman-in-the-Loop\b/i, key: 'human_in_the_loop' },
  { regex: /\bBlast Radius\b/i, key: 'blast_radius' },
  { regex: /\bClean Code\b/i, key: 'clean_code' },
  { regex: /\bCore Domain\b/i, key: 'core_domain' },
  { regex: /\bValue Objects?\b/i, key: 'value_object' },
  { regex: /\bInbound Adapter\b/i, key: 'inbound_adapter' },
  { regex: /\bOutbound (?:Ports?|Adapters?)\b/i, key: 'outbound_ports' },
  { regex: /\bEarly Returns?\b/i, key: 'early_return' },
  { regex: /\bCloudflare Workers\b/i, key: 'workers' },
  { regex: /\bSupabase\b/i, key: 'supabase' },
  { regex: /\b(?:testes\s+)?E2E\b/i, key: 'e2e' },
  { regex: /\bsandboxed?\b/i, key: 'sandbox' },
  { regex: /\bITIL\b/i, key: 'itil' },
  { regex: /\bDRY\b/, key: 'dry' },
  { regex: /\bRCA\b/, key: 'rca' },
  { regex: /\bSLA\b/, key: 'sla' },
  { regex: /\bAST\b/, key: 'ast' },
  { regex: /\bPII\b/, key: 'pii' },
];

export type GlossaryToken =
  | { type: 'text'; value: string }
  | { type: 'term'; value: string; key: GlossaryTermKey };

export function tokenizeGlossaryText(text: string): GlossaryToken[] {
  if (!text) return [];

  const matches: Array<{ start: number; end: number; value: string; key: GlossaryTermKey }> = [];

  for (const { regex, key } of GLOSSARY_PATTERNS) {
    const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
    let match: RegExpExecArray | null;
    while ((match = globalRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        value: match[0],
        key,
      });
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const tokens: GlossaryToken[] = [];
  const seenKeys = new Set<GlossaryTermKey>();
  let cursor = 0;

  for (const m of matches) {
    if (m.start < cursor) continue;
    if (seenKeys.has(m.key)) continue;

    if (m.start > cursor) {
      tokens.push({ type: 'text', value: text.slice(cursor, m.start) });
    }
    tokens.push({ type: 'term', value: m.value, key: m.key });
    seenKeys.add(m.key);
    cursor = m.end;
  }

  if (cursor < text.length) {
    tokens.push({ type: 'text', value: text.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value: text }];
}

export function computeTooltipPosition(
  triggerRect: { top: number; bottom: number; left: number; width: number },
  viewport: { width: number; height: number },
  tooltipSize: { width: number; height: number }
): { top: number; left: number; placement: 'top' | 'bottom' } {
  const padding = 16;
  const gap = 10;

  const centeredLeft = triggerRect.left + triggerRect.width / 2 - tooltipSize.width / 2;
  const maxLeft = Math.max(padding, viewport.width - tooltipSize.width - padding);
  const left = Math.max(padding, Math.min(centeredLeft, maxLeft));

  const fitsBelow = triggerRect.bottom + gap + tooltipSize.height <= viewport.height - padding;
  if (fitsBelow) {
    return {
      top: triggerRect.bottom + gap,
      left,
      placement: 'bottom',
    };
  }

  return {
    top: Math.max(padding, triggerRect.top - tooltipSize.height - gap),
    left,
    placement: 'top',
  };
}
