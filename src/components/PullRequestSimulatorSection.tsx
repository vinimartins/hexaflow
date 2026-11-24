import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Columns2,
  FileDiff,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  MessageSquareCode,
  RotateCcw,
  Rows3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  PR_CHECKS,
  PR_DIFF_FILES,
  PR_SIMULATION_META,
  PrDiffMode,
  PrReviewDecision,
  PrViewTab,
  buildSplitDiffRows,
  getPrFileById,
} from '../utils/prSimulatorLogic';
import { RevealSection } from './RevealSection';
import { GlossaryText } from './TechTerm';

interface PullRequestSimulatorSectionProps {
  onSelectPoc?: () => void;
}

export function PullRequestSimulatorSection({ onSelectPoc }: PullRequestSimulatorSectionProps) {
  const [activeTab, setActiveTab] = useState<PrViewTab>('files');
  const [selectedFileId, setSelectedFileId] = useState<string>(PR_DIFF_FILES[0].id);
  const [diffMode, setDiffMode] = useState<PrDiffMode>('split');
  const [reviewDecision, setReviewDecision] = useState<PrReviewDecision>('pending');

  const activeFile = getPrFileById(selectedFileId);
  const splitRows = buildSplitDiffRows(activeFile.lines);

  const statusBadge =
    reviewDecision === 'approved'
      ? {
          label: 'Approved · Pronto para Merge Humano',
          classes: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-400',
        }
      : reviewDecision === 'changes_requested'
      ? {
          label: 'Changes Requested · Feedback Loop',
          classes: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
        }
      : {
          label: 'Open · Aguardando Review',
          classes: 'border-sky-400/50 bg-sky-400/10 text-sky-300',
        };

  return (
    <section
      id="pull-request-sim"
      className="scroll-mt-16 border-b border-slate-800/80 bg-[#040507] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-sky-400">
              Simulador de Pull Request · Clean Code no GitHub
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              O resultado final no seu GitHub: diffs cirúrgicos com Clean Code e revisão humana obrigatória.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            <GlossaryText text="Navegue pelos arquivos do PR #1084, alterne entre diff Split e Unificado e simule o review com Human-in-the-Loop antes de qualquer merge." />
          </p>
        </RevealSection>

        <RevealSection delay={0.08} className="mt-8">
          <div
            data-testid="pr-simulator-shell"
            className="rounded-xl border border-slate-800 bg-[#0A0B0E] overflow-hidden"
          >
            {/* GitHub PR Header */}
            <div className="border-b border-slate-800 bg-[#12141A]/75 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
                    <span>{PR_SIMULATION_META.repository}</span>
                    <span aria-hidden="true">/</span>
                    <span className="text-sky-400">{PR_SIMULATION_META.ticketRef}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{PR_SIMULATION_META.commitSha}</span>
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-semibold text-slate-50 sm:text-lg">
                    {PR_SIMULATION_META.title}{' '}
                    <span className="font-mono font-normal text-slate-400">{PR_SIMULATION_META.number}</span>
                  </h3>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      data-testid="pr-status-badge"
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono font-semibold ${statusBadge.classes}`}
                    >
                      <GitPullRequest className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{statusBadge.label}</span>
                    </span>

                    <span className="inline-flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <span className="text-slate-200 font-medium">{PR_SIMULATION_META.author}</span>
                      <span>quer aplicar</span>
                      <code className="rounded border border-slate-800 bg-[#040507] px-1.5 py-0.5 text-sky-300">
                        {PR_SIMULATION_META.sourceBranch}
                      </code>
                      <span>→</span>
                      <code className="rounded border border-slate-800 bg-[#040507] px-1.5 py-0.5 text-slate-200">
                        <GitBranch className="mr-1 inline h-3 w-3 align-text-bottom" aria-hidden="true" />
                        {PR_SIMULATION_META.targetBranch}
                      </code>
                    </span>
                  </div>
                </div>

                {/* Aggregate Diff Stat */}
                <div className="flex items-center gap-3 font-mono text-xs shrink-0 self-start rounded-lg border border-slate-800 bg-[#040507] px-3 py-2">
                  <span className="text-slate-400">3 arquivos</span>
                  <span className="font-semibold text-emerald-400 tabular-nums">
                    +{PR_SIMULATION_META.totalAdditions}
                  </span>
                  <span className="font-semibold text-rose-400 tabular-nums">
                    -{PR_SIMULATION_META.totalDeletions}
                  </span>
                </div>
              </div>

              {/* GitHub Tabs + Diff Mode Controls */}
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div role="tablist" aria-label="Visões do Pull Request" className="flex items-center gap-2">
                  <button
                    type="button"
                    role="tab"
                    data-testid="pr-tab-files"
                    aria-selected={activeTab === 'files'}
                    onClick={() => setActiveTab('files')}
                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                      activeTab === 'files'
                        ? 'border-sky-400/60 bg-sky-400/15 text-sky-300'
                        : 'border-slate-800 bg-[#040507] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <FileDiff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Files changed</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200 tabular-nums">
                      {PR_DIFF_FILES.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    data-testid="pr-tab-checks"
                    aria-selected={activeTab === 'checks'}
                    onClick={() => setActiveTab('checks')}
                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                      activeTab === 'checks'
                        ? 'border-sky-400/60 bg-sky-400/15 text-sky-300'
                        : 'border-slate-800 bg-[#040507] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Checks &amp; Guardrails</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-emerald-400 tabular-nums">
                      {PR_CHECKS.length}
                    </span>
                  </button>
                </div>

                {activeTab === 'files' && (
                  <div
                    role="group"
                    aria-label="Modo de visualização do diff"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-[#040507] p-1 self-start sm:self-auto"
                  >
                    <button
                      type="button"
                      data-testid="pr-mode-split"
                      aria-pressed={diffMode === 'split'}
                      onClick={() => setDiffMode('split')}
                      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        diffMode === 'split'
                          ? 'bg-sky-400 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Columns2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>Split</span>
                    </button>
                    <button
                      type="button"
                      data-testid="pr-mode-unified"
                      aria-pressed={diffMode === 'unified'}
                      onClick={() => setDiffMode('unified')}
                      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        diffMode === 'unified'
                          ? 'bg-sky-400 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Rows3 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>Unified</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body Content */}
            {activeTab === 'files' ? (
              <div className="p-4 sm:p-6 space-y-5">
                {/* Changed Files Switcher */}
                <div
                  role="tablist"
                  aria-label="Arquivos alterados no Pull Request"
                  className="grid grid-cols-1 gap-2.5 md:grid-cols-3"
                >
                  {PR_DIFF_FILES.map((file) => {
                    const isSelected = file.id === activeFile.id;
                    return (
                      <button
                        key={file.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        data-testid={`pr-file-tab-${file.id}`}
                        onClick={() => setSelectedFileId(file.id)}
                        className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                          isSelected
                            ? 'border-sky-400/60 bg-[#12141A]'
                            : 'border-slate-800 bg-[#040507] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-medium text-sky-400">
                            {file.layerBadge}
                          </span>
                          <span className="font-mono text-[11px] tabular-nums">
                            <span className="text-emerald-400">+{file.additions}</span>{' '}
                            <span className="text-rose-400">-{file.deletions}</span>
                          </span>
                        </div>
                        <div className="mt-1.5 font-mono text-xs font-semibold text-slate-100 truncate">
                          {file.path}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-slate-400 truncate">
                          {file.cleanCodeRule}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Diff Box (keeps dark syntax colors in both themes via data-code-surface="dark") */}
                <div
                  data-testid="pr-diff-viewport"
                  data-code-surface="dark"
                  className="rounded-lg border border-slate-800 bg-[#040507] overflow-hidden"
                >
                  {/* Diff File Toolbar */}
                  <div className="flex flex-col gap-2.5 border-b border-slate-800 bg-[#0A0B0E] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="font-mono text-xs font-semibold text-slate-100 break-all">
                        {activeFile.path}
                      </span>
                      <span className="rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] font-medium text-sky-300">
                        {activeFile.cleanCodeRule}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] shrink-0">
                      <span className="text-slate-400">
                        Complexidade:{' '}
                        <strong className="text-rose-300 line-through mr-1">{activeFile.complexityBefore}</strong>
                        <strong className="text-emerald-400">{activeFile.complexityAfter}</strong>
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-400">
                        Aninhamento:{' '}
                        <strong className="text-rose-300 line-through mr-1">{activeFile.nestingBefore}</strong>
                        <strong className="text-emerald-400">{activeFile.nestingAfter}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Hunk Info Bar */}
                  <div className="border-b border-slate-800/80 bg-[#12141A]/80 px-4 py-1.5 font-mono text-[11px] text-sky-300/90 overflow-x-auto whitespace-nowrap">
                    {activeFile.hunkHeader}
                  </div>

                  {/* Split vs Unified Diff Rendering */}
                  {diffMode === 'split' ? (
                    <div data-testid="pr-split-diff-view" className="overflow-x-auto">
                      <div className="min-w-[680px]">
                        <div className="grid grid-cols-2 border-b border-slate-800/80 bg-[#0A0B0E] font-mono text-[10px] uppercase tracking-wider text-slate-400">
                          <div className="border-r border-slate-800 px-3 py-1.5">
                            Antes · Legado acoplado (-{activeFile.deletions})
                          </div>
                          <div className="px-3 py-1.5 text-emerald-400">
                            Depois · Clean Code Hexagonal (+{activeFile.additions})
                          </div>
                        </div>

                        <div className="divide-y divide-slate-800/40 font-mono text-xs leading-6">
                          {splitRows.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-2">
                              {/* Left (Old / Removed) */}
                              <div
                                className={`flex border-r border-slate-800 min-w-0 ${
                                  row.left?.type === 'remove'
                                    ? 'bg-rose-500/[0.11] text-rose-100'
                                    : row.left
                                    ? 'text-slate-400'
                                    : 'bg-[#07080B]'
                                }`}
                              >
                                <span className="w-9 select-none border-r border-slate-800/70 px-2 text-right text-[11px] text-slate-500 tabular-nums shrink-0">
                                  {row.left?.oldLine ?? ''}
                                </span>
                                <span className="w-5 select-none text-center text-rose-400 shrink-0">
                                  {row.left?.type === 'remove' ? '-' : ''}
                                </span>
                                <span className="whitespace-pre pr-3">{row.left?.code ?? ''}</span>
                              </div>

                              {/* Right (New / Added) */}
                              <div
                                className={`flex min-w-0 ${
                                  row.right?.type === 'add'
                                    ? 'bg-emerald-500/[0.11] text-emerald-100'
                                    : row.right
                                    ? 'text-slate-300'
                                    : 'bg-[#07080B]'
                                }`}
                              >
                                <span className="w-9 select-none border-r border-slate-800/70 px-2 text-right text-[11px] text-slate-500 tabular-nums shrink-0">
                                  {row.right?.newLine ?? ''}
                                </span>
                                <span className="w-5 select-none text-center text-emerald-400 shrink-0">
                                  {row.right?.type === 'add' ? '+' : ''}
                                </span>
                                <span className="whitespace-pre pr-3">{row.right?.code ?? ''}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div data-testid="pr-unified-diff-view" className="overflow-x-auto">
                      <div className="min-w-[520px] divide-y divide-slate-800/30 font-mono text-xs leading-6">
                        {activeFile.lines.map((line, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              line.type === 'remove'
                                ? 'bg-rose-500/[0.11] text-rose-100'
                                : line.type === 'add'
                                ? 'bg-emerald-500/[0.11] text-emerald-100'
                                : 'text-slate-400'
                            }`}
                          >
                            <span className="w-10 select-none border-r border-slate-800/70 px-2 text-right text-[11px] text-slate-500 tabular-nums shrink-0">
                              {line.oldLine ?? ''}
                            </span>
                            <span className="w-10 select-none border-r border-slate-800/70 px-2 text-right text-[11px] text-slate-500 tabular-nums shrink-0">
                              {line.newLine ?? ''}
                            </span>
                            <span
                              className={`w-6 select-none text-center shrink-0 ${
                                line.type === 'remove'
                                  ? 'text-rose-400'
                                  : line.type === 'add'
                                  ? 'text-emerald-400'
                                  : 'text-slate-600'
                              }`}
                            >
                              {line.type === 'remove' ? '-' : line.type === 'add' ? '+' : ' '}
                            </span>
                            <span className="whitespace-pre pr-4">{line.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline HexaFlow Review Annotation */}
                  <div className="border-t border-slate-800 bg-[#0A0B0E] px-4 py-3">
                    <div className="flex items-start gap-2.5 text-xs">
                      <MessageSquareCode className="mt-0.5 h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                          <span className="font-semibold text-slate-100">{activeFile.reviewAuthor}</span>
                          <span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 text-[10px] text-sky-300">
                            Guardrail Clean Code
                          </span>
                        </div>
                        <p className="mt-1 leading-relaxed text-slate-300">{activeFile.reviewNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Checks & Guardrails Tab */
              <div data-testid="pr-checks-panel" className="p-4 sm:p-6 space-y-3">
                {PR_CHECKS.map((check) => (
                  <div
                    key={check.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-[#040507] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      {check.status === 'passed' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-amber-300 shrink-0" aria-hidden="true" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-slate-100">{check.name}</div>
                        <p className="mt-0.5 text-xs text-slate-400">{check.detail}</p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-medium shrink-0 self-start sm:self-center ${
                        check.status === 'passed' ? 'text-emerald-400' : 'text-amber-300'
                      }`}
                    >
                      {check.status === 'passed' ? `Passou · ${check.duration}` : 'Política Ativa'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Simulated Human-in-the-Loop Review Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-800 bg-[#12141A]/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-2.5 text-xs">
                <Sparkles className="mt-0.5 h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                <div className="text-slate-300">
                  {reviewDecision === 'approved' ? (
                    <span data-testid="pr-review-feedback" className="font-medium text-emerald-400">
                      Review aprovado pelo Tech Lead: o merge continua manual e o padrão entra na memória arquitetural.
                    </span>
                  ) : reviewDecision === 'changes_requested' ? (
                    <span data-testid="pr-review-feedback" className="font-medium text-amber-300">
                      Ajuste solicitado: o HexaFlow reexecuta o estágio N3 em sandbox incorporando o feedback humano.
                    </span>
                  ) : (
                    <span data-testid="pr-review-feedback">
                      <GlossaryText text="Simule o code review Human-in-the-Loop: zero auto-merge, decisão 100% do seu time." />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  data-testid="pr-action-approve"
                  onClick={() => setReviewDecision('approved')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    reviewDecision === 'approved'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'border border-emerald-400/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Aprovar Review</span>
                </button>

                <button
                  type="button"
                  data-testid="pr-action-changes"
                  onClick={() => setReviewDecision('changes_requested')}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    reviewDecision === 'changes_requested'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-slate-700 bg-[#040507] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Feedback Loop</span>
                </button>

                {onSelectPoc && (
                  <button
                    type="button"
                    onClick={onSelectPoc}
                    className="inline-flex items-center gap-1.5 rounded-md bg-sky-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <span>Testar no meu repo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
