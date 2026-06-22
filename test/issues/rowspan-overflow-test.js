const Table = require('../..');

test('a rowSpan that extends past the last row renders instead of throwing', () => {
  const table = new Table();
  table.push([{ content: 'aaaa bbbb', rowSpan: 2 }]);

  let output;
  expect(() => {
    output = table.toString();
  }).not.toThrow();
  expect(output).toContain('aaaa bbbb');
});
