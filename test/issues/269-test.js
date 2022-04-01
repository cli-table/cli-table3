const Table = require('../..');

test('it renders rowSpan correctly', () => {
  let table = new Table({ style: { border: [], head: [] } });
  table.push([{ rowSpan: 3, content: 'A1' }, 'B1', 'C1'], [{ rowSpan: 2, content: 'B2' }, 'C2'], ['C3']);
  let expected = [
    '┌────┬────┬────┐',
    '│ A1 │ B1 │ C1 │',
    '│    ├────┼────┤',
    '│    │ B2 │ C2 │',
    '│    │    ├────┤',
    '│    │    │ C3 │',
    '└────┴────┴────┘',
  ];
  expect(table.toString()).toEqual(expected.join('\n'));
});
