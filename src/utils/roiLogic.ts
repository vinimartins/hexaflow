export interface RoiInputs {
  seniorDevs: number;
  firefightingSharePercent: number;
  seniorMonthlyCostBrl: number;
  automationCapturePercent: number;
}

export interface RoiPreset {
  id: 'seed' | 'scaleup' | 'midmarket';
  label: string;
  description: string;
  inputs: RoiInputs;
}

export interface RoiProjection {
  currentWeeklyHoursLost: number;
  currentMonthlyHoursLost: number;
  currentMonthlyCostLostBrl: number;
  savedHoursPerWeek: number;
  savedHoursPerMonth: number;
  savedMonthlyBrl: number;
  savedAnnualBrl: number;
  reclaimedSeniorFtes: number;
  reclaimedDevWeeksPerYear: number;
}

export const WEEKLY_WORKING_HOURS = 40;
export const MONTHLY_WORKING_HOURS = 160;

export const ROI_LIMITS = {
  seniorDevs: { min: 2, max: 40, step: 1 },
  firefightingSharePercent: { min: 15, max: 60, step: 5 },
  seniorMonthlyCostBrl: { min: 15000, max: 45000, step: 1000 },
  automationCapturePercent: { min: 50, max: 80, step: 5 },
} as const;

export const DEFAULT_ROI_INPUTS: RoiInputs = {
  seniorDevs: 8,
  firefightingSharePercent: 40,
  seniorMonthlyCostBrl: 24000,
  automationCapturePercent: 70,
};

export const ROI_PRESETS: RoiPreset[] = [
  {
    id: 'seed',
    label: '15 devs · ~4 sêniores',
    description: 'SaaS em tração (4 sêniores)',
    inputs: {
      seniorDevs: 4,
      firefightingSharePercent: 40,
      seniorMonthlyCostBrl: 22000,
      automationCapturePercent: 70,
    },
  },
  {
    id: 'scaleup',
    label: '35 devs · ~8 sêniores',
    description: 'Scale-up SaaS (8 sêniores)',
    inputs: {
      seniorDevs: 8,
      firefightingSharePercent: 40,
      seniorMonthlyCostBrl: 24000,
      automationCapturePercent: 70,
    },
  },
  {
    id: 'midmarket',
    label: '70 devs · ~18 sêniores',
    description: 'Operação Tech consolidada (18 sêniores)',
    inputs: {
      seniorDevs: 18,
      firefightingSharePercent: 35,
      seniorMonthlyCostBrl: 26000,
      automationCapturePercent: 70,
    },
  },
];

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function clampRoiInputs(inputs: RoiInputs): RoiInputs {
  return {
    seniorDevs: Math.round(
      clamp(inputs.seniorDevs, ROI_LIMITS.seniorDevs.min, ROI_LIMITS.seniorDevs.max)
    ),
    firefightingSharePercent: Math.round(
      clamp(
        inputs.firefightingSharePercent,
        ROI_LIMITS.firefightingSharePercent.min,
        ROI_LIMITS.firefightingSharePercent.max
      )
    ),
    seniorMonthlyCostBrl: Math.round(
      clamp(
        inputs.seniorMonthlyCostBrl,
        ROI_LIMITS.seniorMonthlyCostBrl.min,
        ROI_LIMITS.seniorMonthlyCostBrl.max
      )
    ),
    automationCapturePercent: Math.round(
      clamp(
        inputs.automationCapturePercent,
        ROI_LIMITS.automationCapturePercent.min,
        ROI_LIMITS.automationCapturePercent.max
      )
    ),
  };
}

export function calculateRoiProjection(rawInputs: RoiInputs): RoiProjection {
  const inputs = clampRoiInputs(rawInputs);
  const burnRatio = inputs.firefightingSharePercent / 100;
  const captureRatio = inputs.automationCapturePercent / 100;

  const currentWeeklyHoursLost = Math.round(inputs.seniorDevs * WEEKLY_WORKING_HOURS * burnRatio);
  const currentMonthlyHoursLost = Math.round(inputs.seniorDevs * MONTHLY_WORKING_HOURS * burnRatio);
  const currentMonthlyCostLostBrl = Math.round(
    inputs.seniorDevs * inputs.seniorMonthlyCostBrl * burnRatio
  );

  const savedHoursPerWeek = Math.round(currentWeeklyHoursLost * captureRatio);
  const savedHoursPerMonth = Math.round(currentMonthlyHoursLost * captureRatio);
  const savedMonthlyBrl = Math.round(currentMonthlyCostLostBrl * captureRatio);
  const savedAnnualBrl = savedMonthlyBrl * 12;

  const reclaimedSeniorFtes = Number((savedHoursPerMonth / MONTHLY_WORKING_HOURS).toFixed(1));
  const reclaimedDevWeeksPerYear = Math.round((savedHoursPerWeek * 52) / WEEKLY_WORKING_HOURS);

  return {
    currentWeeklyHoursLost,
    currentMonthlyHoursLost,
    currentMonthlyCostLostBrl,
    savedHoursPerWeek,
    savedHoursPerMonth,
    savedMonthlyBrl,
    savedAnnualBrl,
    reclaimedSeniorFtes,
    reclaimedDevWeeksPerYear,
  };
}

export function formatBrlCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}
