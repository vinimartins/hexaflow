import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ROI_INPUTS,
  ROI_LIMITS,
  ROI_PRESETS,
  calculateRoiProjection,
  clampRoiInputs,
  formatBrlCurrency,
} from './roiLogic';

test('calculateRoiProjection computes accurate monthly/annual savings and reclaimed capacity', () => {
  const result = calculateRoiProjection(DEFAULT_ROI_INPUTS);
  // 8 senior devs * 160h * 40% = 512h/month lost; * 70% capture = 358h/month saved
  assert.equal(result.currentMonthlyHoursLost, 512);
  assert.equal(result.savedHoursPerMonth, 358);
  // 8 * 40h * 40% = 128h/week lost; * 70% = 90h/week saved
  assert.equal(result.currentWeeklyHoursLost, 128);
  assert.equal(result.savedHoursPerWeek, 90);
  // 8 * 24000 * 40% = 76800 BRL/month lost; * 70% = 53760 BRL/month saved
  assert.equal(result.currentMonthlyCostLostBrl, 76800);
  assert.equal(result.savedMonthlyBrl, 53760);
  assert.equal(result.savedAnnualBrl, 53760 * 12);
  assert.equal(result.reclaimedSeniorFtes, 2.2);
  assert.ok(result.reclaimedDevWeeksPerYear > 100);
});

test('clampRoiInputs enforces valid bounds and presets match team tiers', () => {
  const clamped = clampRoiInputs({
    seniorDevs: 999,
    firefightingSharePercent: -10,
    seniorMonthlyCostBrl: 500,
    automationCapturePercent: 95,
  });

  assert.equal(clamped.seniorDevs, ROI_LIMITS.seniorDevs.max);
  assert.equal(clamped.firefightingSharePercent, ROI_LIMITS.firefightingSharePercent.min);
  assert.equal(clamped.seniorMonthlyCostBrl, ROI_LIMITS.seniorMonthlyCostBrl.min);
  assert.equal(clamped.automationCapturePercent, ROI_LIMITS.automationCapturePercent.max);

  assert.equal(ROI_PRESETS.length, 3);
  const formatted = formatBrlCurrency(53760);
  assert.ok(formatted.includes('53.760'));
});
