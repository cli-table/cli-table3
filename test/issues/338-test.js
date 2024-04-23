const Table = require('../..');

test('closes href tag on truncated content', () => {
  const href = 'http://example.com';

  const table = new Table({ colWidths: [10], style: { border: [], head: [] } });

  table.push([{ content: 'looooooooooooong', href }]);

  expect(table.toString().includes('\x1B]8;;\x07')).toEqual(true);
});
