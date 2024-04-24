const Table = require('../..');

test('closes href tag on truncated content', () => {
  const href = 'http://example.com';

  const table = new Table({ colWidths: [15], style: { border: [], head: [] } });

  table.push([{ content: 'looooooooooong', href }]);

  const expected = [
    '┌───────────────┐',
    '│ \x1B]8;;http://example.com\x07looooooooooo…\x1B]8;;\x07 │',
    '└───────────────┘',
  ];

  expect(table.toString()).toEqual(expected.join('\n'));
});
