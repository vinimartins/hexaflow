import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PR_CHECKS,
  PR_DIFF_FILES,
  PR_SIMULATION_META,
  buildSplitDiffRows,
  getPrFileById,
} from './prSimulatorLogic';

test('PR simulation metadata and diff files enforce Clean Code complexity reduction', () => {
  assert.equal(PR_DIFF_FILES.length, 3);
  assert.ok(PR_SIMULATION_META.totalAdditions > 0);
  assert.ok(PR_SIMULATION_META.totalDeletions > 0);

  let sumAdditions = 0;
  let sumDeletions = 0;

  for (const file of PR_DIFF_FILES) {
    assert.ok(file.complexityAfter < file.complexityBefore);
    assert.ok(file.nestingAfter < file.nestingBefore);
    const actualAdds = file.lines.filter((l) => l.type === 'add').length;
    const actualDeletes = file.lines.filter((l) => l.type === 'remove').length;
    assert.equal(file.additions, actualAdds);
    assert.equal(file.deletions, actualDeletes);
    sumAdditions += actualAdds;
    sumDeletions += actualDeletes;
  }

  assert.equal(PR_SIMULATION_META.totalAdditions, sumAdditions);
  assert.equal(PR_SIMULATION_META.totalDeletions, sumDeletions);
  assert.equal(PR_CHECKS.some((c) => c.status === 'enforced'), true);
});

test('getPrFileById falls back cleanly and buildSplitDiffRows pairs removals and additions', () => {
  const fallback = getPrFileById('missing-file');
  assert.equal(fallback.id, PR_DIFF_FILES[0].id);

  const splitRows = buildSplitDiffRows(fallback.lines);
  assert.ok(splitRows.length > 0);
  assert.equal(splitRows[0].left?.type, 'context');
  assert.equal(splitRows[0].right?.type, 'context');

  const removeCount = splitRows.filter((r) => r.left?.type === 'remove').length;
  const addCount = splitRows.filter((r) => r.right?.type === 'add').length;
  assert.equal(removeCount, fallback.deletions);
  assert.equal(addCount, fallback.additions);
});
