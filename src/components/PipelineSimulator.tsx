import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, GitPullRequest, Pause, Play, RotateCcw, ShieldAlert, Terminal } from 'lucide-react';
import {
  PIPELINE_SCENARIOS,
  getScenarioById,
  getStageProgressPercent,
  getVisibleLogs,
} from '../utils/pipelineLogic';

const STAGE_SHORT_NAMES = ['Triagem', 'RCA & DRY', 'Sandbox', 'Patch N3', 'Humano'] as const;

export function PipelineSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PIPELINE_SCENARIOS[0].id);
  const [stepCount, setStepCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  const scenario = getScenarioById(selectedScenarioId);
  const totalSteps = scenario.logs.length;
  const visibleLogs = getVisibleLogs(scenario, stepCount);
  const activeLog = visibleLogs[visibleLogs.length - 1];
  const progressPercent = getStageProgressPercent(visibleLogs.length, totalSteps);
  const isCompleted = visibleLogs.length >= totalSteps;

  useEffect(() => {
    if (!isPlaying || isCompleted) return;
    const timer = window.setTimeout(() => {
      setStepCount((prev) => Math.min(prev + 1, totalSteps));
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [isPlaying, isCompleted, stepCount, totalSteps, selectedScenarioId]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setStepCount(1);
    setIsPlaying(true);
  };

  const handleReplay = () => {
    setStepCount(1);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isCompleted) {
      handleReplay();
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div
      data-testid="pipeline-simulator"
      data-code-surface="dark"
      className="flex h-full flex-col rounded-xl border border-slate-800 bg-[#0A0B0E] overflow-hidden shadow-lg shadow-slate-950/20"
    >
      {/* Single-row Compact Terminal Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-[#040507] px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden="true" />
          <div className="flex items-center gap-1 font-mono text-[11px] min-w-0">
            <span className="font-medium text-sky-400 shrink-0">hexaflow-ops</span>
            <span className="text-slate-600 shrink-0" aria-hidden="true">/</span>
            <span className="text-slate-200 truncate">{scenario.repository}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden sm:inline font-mono text-[11px] font-medium text-emerald-400 tabular-nums whitespace-nowrap">
            {scenario.slaSummary}
          </span>
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={
              isCompleted
                ? 'Reexecutar pipeline'
                : isPlaying
                ? 'Pausar execução do pipeline'
                : 'Continuar execução do pipeline'
            }
            className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-[#12141A] px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isCompleted ? (
              <>
                <RotateCcw className="h-3 w-3 text-sky-400" />
                <span>Reexecutar</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-sky-400" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-sky-400" />
                <span>Executar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div
        role="tablist"
        aria-label="Cenários de chamado corporativo"
        className="grid grid-cols-3 gap-1 border-b border-slate-800/80 bg-[#07080B] px-3 py-1.5"
      >
        {PIPELINE_SCENARIOS.map((item) => {
          const active = item.id === scenario.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectScenario(item.id)}
              className={`rounded px-2 py-1.5 font-mono text-[11px] font-medium text-center transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                active
                  ? 'bg-sky-400/15 text-sky-300 border border-sky-400/45'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-900/50'
              }`}
            >
              <span className="sm:hidden">{item.ticketCode}</span>
              <span className="hidden sm:inline">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Ticket Summary + Progress Bar + Named 5-Stage Stepper */}
      <div className="border-b border-slate-800/80 bg-[#0D0F14] px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-slate-100 truncate">{scenario.title}</span>
          <span className="font-mono text-[11px] font-semibold text-sky-400 tabular-nums shrink-0">
            {visibleLogs.length}/{totalSteps} · {progressPercent}%
          </span>
        </div>

        {/* Continuous Progress Track */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
          <div
            className={`h-full transition-all duration-300 ${
              isCompleted ? 'bg-emerald-400' : 'bg-sky-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2.5 grid grid-cols-5 gap-1" role="group" aria-label="Estágios N1 a N3">
          {scenario.logs.map((log, index) => {
            const stepNum = index + 1;
            const reached = stepNum <= visibleLogs.length;
            const isCurrent = stepNum === visibleLogs.length;
            const stageTag = stepNum === 5 ? 'PR' : log.tier;
            return (
              <button
                key={log.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepCount(stepNum);
                }}
                aria-label={`Ir para estágio ${stepNum}: ${log.tier} ${log.phase}`}
                className={`flex flex-col items-start rounded px-2 py-1.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isCurrent
                    ? 'bg-sky-400/15 border border-sky-400/55 text-sky-200'
                    : reached
                    ? 'bg-[#12141A] border border-emerald-400/30 text-slate-200'
                    : 'bg-[#07080B] border border-slate-800/70 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="font-mono text-[10px] font-semibold tracking-wide">
                  {stageTag}
                </span>
                <span className="mt-0.5 hidden sm:block truncate w-full font-sans text-[10px] text-slate-400">
                  {STAGE_SHORT_NAMES[index]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Timeline + Expanded Active Stage Card */}
      <div className="flex-1 flex flex-col justify-between gap-2.5 p-3.5 sm:p-4">
        {/* Compact Terminal History Rows (reached steps before current) */}
        <div className="space-y-1 font-mono text-[11px]">
          {visibleLogs.map((entry, idx) => {
            const isCurrent = idx === visibleLogs.length - 1;
            const isGate = entry.status === 'awaiting_human';
            if (isCurrent) return null;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepCount(idx + 1);
                }}
                className="flex w-full items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left hover:bg-[#12141A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-500 tabular-nums shrink-0">{entry.timestamp}</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      entry.tier === 'N1'
                        ? 'text-slate-300'
                        : entry.tier === 'N2'
                        ? 'text-sky-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    [{entry.tier}]
                  </span>
                  <span className="text-slate-300 truncate">{entry.phase}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 shrink-0 ${
                    isGate ? 'text-amber-300' : 'text-emerald-400'
                  }`}
                >
                  <Check className="h-3 w-3" aria-hidden="true" />
                  <span>{entry.slaLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Focused Active Stage Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario.id}-${activeLog.id}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={`rounded-lg border p-3.5 ${
              activeLog.status === 'awaiting_human'
                ? 'border-amber-500/45 bg-amber-500/[0.06]'
                : 'border-sky-400/35 bg-[#12141A]/85'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 tabular-nums">{activeLog.timestamp}</span>
                <span
                  className={`font-semibold ${
                    activeLog.tier === 'N1'
                      ? 'text-slate-200'
                      : activeLog.tier === 'N2'
                      ? 'text-sky-400'
                      : 'text-emerald-400'
                  }`}
                >
                  [{activeLog.tier}]
                </span>
                <span className="font-semibold text-slate-100">{activeLog.phase}</span>
              </div>

              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                  activeLog.status === 'awaiting_human' ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                {activeLog.status === 'awaiting_human' ? (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{activeLog.slaLabel}</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{activeLog.slaLabel}</span>
                  </>
                )}
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-200">
              {activeLog.message}
            </p>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{activeLog.detail}</p>
          </motion.div>
        </AnimatePresence>

        {/* Compact Patch Preview (Visible on N3 patch / PR stage) */}
        {visibleLogs.length >= 4 && (
          <div className="rounded-lg border border-slate-800 bg-[#040507] p-3 font-mono text-[10.5px]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-slate-200 font-semibold min-w-0">
                <GitPullRequest className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{scenario.prNumber} · {scenario.branchName}</span>
              </span>
              <span className="text-emerald-400 shrink-0">{scenario.testsPassed}</span>
            </div>
            <div className="overflow-x-auto">
              <div className="w-max min-w-full space-y-0.5 leading-5">
                {scenario.diffLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.type === 'remove'
                        ? 'text-rose-300 bg-rose-500/12 px-2 rounded-sm whitespace-pre'
                        : line.type === 'add'
                        ? 'text-emerald-300 bg-emerald-500/12 px-2 rounded-sm whitespace-pre'
                        : 'text-slate-400 px-2 whitespace-pre'
                    }
                  >
                    {line.code.trimStart().length === line.code.length ? line.code : line.code.replace(/^  /, '')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact Governance Footer */}
      <div className="border-t border-slate-800 bg-[#040507] px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-slate-400">
            Blast Radius: <strong className="text-slate-200 font-medium">{scenario.blastRadius}</strong>
          </span>
          <span className="text-sky-300">{scenario.dryCheck}</span>
        </div>

        <p className="mt-1.5 border-t border-slate-800/80 pt-1.5 font-mono text-[10px] text-slate-500">
          Simulação ilustrativa baseada no fluxo piloto N1 → N2 → N3 e suítes em sandbox.
        </p>
      </div>
    </div>
  );
}
