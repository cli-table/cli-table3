const Table = require('../..');

describe.each(['http://example.com/!', 'http://example.com/#!/route', 'http://example.com/日本語'])(
  'hyperlinks to %s',
  (href) => {
    test('preserves the label and URL in an automatically sized cell', () => {
      const table = new Table({ style: { border: [], head: [] } });
      table.push([{ content: 'Text Link', href }]);

      expect(table.toString()).toEqual(
        ['┌───────────┐', `│ \x1B]8;;${href}\x07Text Link\x1B]8;;\x07 │`, '└───────────┘'].join('\n')
      );
    });

    test('truncates the label without changing the URL', () => {
      const table = new Table({ colWidths: [8], style: { border: [], head: [] } });
      table.push([{ content: 'Text Link', href }]);

      expect(table.toString()).toEqual(
        ['┌────────┐', `│ \x1B]8;;${href}\x07Text …\x1B]8;;\x07 │`, '└────────┘'].join('\n')
      );
    });
  }
);
