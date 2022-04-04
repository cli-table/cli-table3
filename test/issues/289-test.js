const Table = require('../..');

describe('erroneous colSpan does not get truncated', () => {
  test('before row with column width', () => {
    const table = new Table({ style: { border: [], head: [] } });
    table.push([{ colSpan: 2, content: 'I should not be truncated' }]);
    let expected = [
      '┌────────────────────────────┐',
      '│ I should not be truncated  │',
      '└────────────────────────────┘',
    ];
    expect(table.toString()).toEqual(expected.join('\n'));
  });
  test('after row with column width', () => {
    const table = new Table({ style: { head: [], border: [] } });
    table.push(
      [{ content: '0-0 (1x3)', colSpan: 3, rowSpan: 1 }],
      [
        { content: '1-0 (2x2)', colSpan: 2, rowSpan: 2 },
        { content: '1-2 (2x1)', colSpan: 1, rowSpan: 2 },
      ],
      []
    );
    let expected = [
      '┌────────────────────────┐',
      '│ 0-0 (1x3)              │',
      '├────────────┬───────────┤',
      '│ 1-0 (2x2)  │ 1-2 (2x1) │',
      '│            │           │',
      '│            │           │',
      '└────────────┴───────────┘',
    ];
    expect(table.toString()).toEqual(expected.join('\n'));
  });
});
