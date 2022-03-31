// https://stackoverflow.com/questions/57811827/how-can-jestjs-test-a-function-that-uses-performance-now#comment119942317_57825692
const { performance } = require('perf_hooks');
const Table = require('..');
const { makeTableLayout } = require('../src/layout-manager');

function genTable(rows, cols) {
  const table = new Table();
  const row = [];
  for (let c = 0; c < cols; c++) {
    row.push({});
  }
  for (let r = 0; r < rows; r++) {
    table.push(row);
  }
  return table;
}

function renderTime(table, samples = 9) {
  const results = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    makeTableLayout(table);
    results.push(performance.now() - start);
  }
  // return results.sort((a, b) => a - b).shift();
  return results[Math.ceil(results.length / 2)];
}

describe('CLI-Table3 Rendering Performance', () => {
  const max = 100;
  let y = 5;
  let x = 5;
  let last = renderTime(genTable(3, 3));
  const samples = [];
  while (y * x <= max) {
    const value = renderTime(genTable(y, x));
    samples.push({ x, y, value, last });
    last = value;
    if (y % 2) x += 1;
    y += 1;
  }
  samples.forEach((sample) => {
    it(`renders ${sample.y}x${sample.x} linearly`, () => {
      expect(sample.value - sample.last).toBeLessThanOrEqual(0.02);
    });
  });
  it('renders 100k cells in under 3 seconds', () => {
    let table = genTable(1000, 100);
    const start = performance.now();
    table.toString();
    expect(performance.now() - start).toBeLessThanOrEqual(3000);
  });
});
