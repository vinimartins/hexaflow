import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getToggledThemePreference,
  isValidThemePreference,
  resolveTheme,
} from './themeLogic';

test('resolveTheme respects system preference when set to system and honors manual overrides', () => {
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
});

test('getToggledThemePreference flips resolved theme and isValidThemePreference guards values', () => {
  assert.equal(getToggledThemePreference('dark'), 'light');
  assert.equal(getToggledThemePreference('light'), 'dark');

  assert.equal(isValidThemePreference('system'), true);
  assert.equal(isValidThemePreference('dark'), true);
  assert.equal(isValidThemePreference('light'), true);
  assert.equal(isValidThemePreference('sepia'), false);
  assert.equal(isValidThemePreference(null), false);
});
