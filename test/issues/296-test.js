const Table = require('../..');

/**
 * This test doesn't actually fail it never completes. I could not find a method
 * to get the infinite loop to timeout within the test. Not sure how GHA will
 * handle this.
 */
test('it should not loop infinitely with invalid table data', async () => {
  const table = new Table();
  table.push(
    [
      { content: 'A', colSpan: 2 },
      { content: 'B', rowSpan: 3 },
    ],
    [],
    [{ content: 'C', colSpan: 3 }]
  );
  expect(() => table.toString()).not.toThrow();
});

test('it should not error on invalid table data', () => {
  const table = new Table({ debug: true });
  table.push(
    [
      { content: 'A', colSpan: 2 },
      { content: 'B', rowSpan: 3 },
    ],
    [{ content: 'C', colSpan: 3 }]
  );
  expect(() => table.toString()).not.toThrow();
  // This expectation can be dropped if the expectation in the code changes
  expect(table.messages).toContain('2-2: Expected empty array for row 1 (line 2).');
});
