const Table = require('../..');

describe('empty row separators with column spans', () => {
  const options = {
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    colWidths: [5, 5],
    style: { head: [], border: [] },
  };

  test('does not draw a junction below a spanning cell', () => {
    const table = new Table(options);
    table.push([{ content: 'wide', colSpan: 2 }], ['one', 'two']);

    expect(table.toString()).toEqual(['┌───────────┐', '│ wide      │', '│ one │ two │', '└─────┴─────┘'].join('\n'));
  });

  test('does not draw a junction above a spanning cell', () => {
    const table = new Table(options);
    table.push(['one', 'two'], [{ content: 'wide', colSpan: 2 }]);

    expect(table.toString()).toEqual(['┌─────┬─────┐', '│ one │ two │', '│ wide      │', '└───────────┘'].join('\n'));
  });
});
