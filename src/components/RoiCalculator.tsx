import { useState } from 'react';
import { ArrowRight, Calculator, Clock, TrendingUp } from 'lucide-react';
import { RevealSection } from './RevealSection';
import {
  DEFAULT_ROI_INPUTS,
  ROI_LIMITS,
  ROI_PRESETS,
  RoiInputs,
  calculateRoiProjection,
  formatBrlCurrency,
} from '../utils/roiLogic';

interface RoiCalculatorProps {
  onSelectPoc?: () => void;
}

export function RoiCalculator({ onSelectPoc }: RoiCalculatorProps) {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_ROI_INPUTS);
  const [activePresetId, setActivePresetId] = useState<string>('scaleup');

  const projection = calculateRoiProjection(inputs);

  const updateInput = <K extends keyof RoiInputs>(key: K, value: number) => {
    setActivePresetId('custom');
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (presetId: string) => {
    const found = ROI_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setInputs(found.inputs);
  };

  return (
    <RevealSection delay={0.16} className="mt-8">
      <div
        data-testid="roi-calculator"
        className="rounded-xl border border-slate-800 bg-[#0A0B0E] p-6 sm:p-8"
      >
        {/* Header + Team Scale Presets */}
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs font-medium text-sky-400">
              <Calculator className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Calculadora de ROI · Automação N1/N2</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              Estime quanto tempo e orçamento seu time sênior recupera por mês.
            </h3>
            <p className="mt-1.5 text-sm text-slate-300">
              Ajuste o tamanho da engenharia sênior, o peso atual de chamados N1/N2 e o custo mensal médio.
            </p>
          </div>

          <div
            role="group"
            aria-label="Perfis de porte de time SaaS & Tech"
            className="flex flex-wrap gap-1.5 shrink-0"
          >
            {ROI_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  data-testid={`roi-preset-${preset.id}`}
                  aria-pressed={isSelected}
                  onClick={() => applyPreset(preset.id)}
                  className={`rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isSelected
                      ? 'border-sky-400/60 bg-sky-400/15 text-sky-300'
                      : 'border-slate-800 bg-[#040507] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders & Live Results */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left: 4 Interactive Controls */}
          <div className="space-y-5 lg:col-span-6">
            {/* Slider 1: Senior Devs */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <label htmlFor="roi-senior-devs" className="font-medium text-slate-200">
                  Devs sêniores impactados por sustentação
                </label>
                <span
                  data-testid="roi-val-devs"
                  className="font-mono font-semibold text-sky-400 tabular-nums shrink-0"
                >
                  {inputs.seniorDevs} devs
                </span>
              </div>
              <input
                id="roi-senior-devs"
                type="range"
                min={ROI_LIMITS.seniorDevs.min}
                max={ROI_LIMITS.seniorDevs.max}
                step={ROI_LIMITS.seniorDevs.step}
                value={inputs.seniorDevs}
                onChange={(e) => updateInput('seniorDevs', Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#12141A] accent-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>{ROI_LIMITS.seniorDevs.min} devs</span>
                <span>{ROI_LIMITS.seniorDevs.max} devs</span>
              </div>
            </div>

            {/* Slider 2: Firefighting Share % */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <label htmlFor="roi-firefighting" className="font-medium text-slate-200">
                  Tempo semanal perdido em incêndios N1/N2
                </label>
                <span
                  data-testid="roi-val-share"
                  className="font-mono font-semibold text-sky-400 tabular-nums shrink-0"
                >
                  {inputs.firefightingSharePercent}% da semana
                </span>
              </div>
              <input
                id="roi-firefighting"
                type="range"
                min={ROI_LIMITS.firefightingSharePercent.min}
                max={ROI_LIMITS.firefightingSharePercent.max}
                step={ROI_LIMITS.firefightingSharePercent.step}
                value={inputs.firefightingSharePercent}
                onChange={(e) => updateInput('firefightingSharePercent', Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#12141A] accent-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>15%</span>
                <span>40% (média SaaS)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Slider 3: Monthly Cost per Senior Dev */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <label htmlFor="roi-cost" className="font-medium text-slate-200">
                  Custo mensal total por dev sênior
                </label>
                <span
                  data-testid="roi-val-cost"
                  className="font-mono font-semibold text-sky-400 tabular-nums shrink-0"
                >
                  {formatBrlCurrency(inputs.seniorMonthlyCostBrl)}
                </span>
              </div>
              <input
                id="roi-cost"
                type="range"
                min={ROI_LIMITS.seniorMonthlyCostBrl.min}
                max={ROI_LIMITS.seniorMonthlyCostBrl.max}
                step={ROI_LIMITS.seniorMonthlyCostBrl.step}
                value={inputs.seniorMonthlyCostBrl}
                onChange={(e) => updateInput('seniorMonthlyCostBrl', Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#12141A] accent-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>R$ 15 mil</span>
                <span>R$ 30 mil</span>
                <span>R$ 45 mil</span>
              </div>
            </div>

            {/* Slider 4: Automation Capture % */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <label htmlFor="roi-capture" className="font-medium text-slate-200">
                  Redução na fila N1/N2 com HexaFlow
                </label>
                <span
                  data-testid="roi-val-capture"
                  className="font-mono font-semibold text-emerald-400 tabular-nums shrink-0"
                >
                  {inputs.automationCapturePercent}% automatizado
                </span>
              </div>
              <input
                id="roi-capture"
                type="range"
                min={ROI_LIMITS.automationCapturePercent.min}
                max={ROI_LIMITS.automationCapturePercent.max}
                step={ROI_LIMITS.automationCapturePercent.step}
                value={inputs.automationCapturePercent}
                onChange={(e) => updateInput('automationCapturePercent', Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#12141A] accent-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>50% (conservador)</span>
                <span>72% (piloto AEEPET)</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          {/* Right: Real-Time ROI Output Summary */}
          <div className="flex flex-col justify-between rounded-xl border border-sky-400/35 bg-[#12141A] p-5 sm:p-6 lg:col-span-6">
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-[#040507] p-4">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>Economia mensal estimada</span>
                  </div>
                  <div
                    data-testid="roi-monthly-brl"
                    className="mt-2 font-mono text-2xl sm:text-[1.65rem] font-semibold text-emerald-400 tabular-nums"
                  >
                    {formatBrlCurrency(projection.savedMonthlyBrl)}
                  </div>
                  <p data-testid="roi-annual-brl" className="mt-1 font-mono text-xs text-slate-300 tabular-nums">
                    {formatBrlCurrency(projection.savedAnnualBrl)} / ano devolvidos
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-[#040507] p-4">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                    <span>Tempo sênior recuperado</span>
                  </div>
                  <div
                    data-testid="roi-monthly-hours"
                    className="mt-2 font-mono text-2xl sm:text-[1.65rem] font-semibold text-sky-400 tabular-nums"
                  >
                    {projection.savedHoursPerMonth} h/mês
                  </div>
                  <p className="mt-1 font-mono text-xs text-slate-300 tabular-nums">
                    ~{projection.reclaimedSeniorFtes} sêniores livres ({projection.savedHoursPerWeek}h/sem)
                  </p>
                </div>
              </div>

              <dl className="mt-4 space-y-2.5 rounded-lg border border-slate-800/90 bg-[#040507]/75 px-4 py-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-400">Custo atual drenado em N1/N2:</dt>
                  <dd className="font-mono font-medium text-rose-300 tabular-nums">
                    {formatBrlCurrency(projection.currentMonthlyCostLostBrl)}/mês ({projection.currentMonthlyHoursLost}h)
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-2.5">
                  <dt className="text-slate-400">Capacidade devolvida ao roadmap:</dt>
                  <dd className="font-mono font-semibold text-emerald-400 tabular-nums">
                    +{projection.reclaimedDevWeeksPerYear} semanas-dev/ano
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-relaxed text-slate-400">
                Base: 160h/mês por dev sênior. O ganho real é validado com tickets reais na PoC.
              </p>

              {onSelectPoc ? (
                <button
                  type="button"
                  onClick={onSelectPoc}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <span>Validar ROI na PoC</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <a
                  href="#diagnostico"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <span>Validar ROI na PoC</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
