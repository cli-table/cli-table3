const Table = require('../..');

test('cell padding of zero overrides table options', () => {
  let table = new Table({
    style: {
      'padding-left': 1,
      //      'padding-right': 1,
      border: [],
      header: [],
    },
  });

  table.push([
    {
      content: 'a',
      style: {
        'padding-left': 5,
      },
    },
    {
      content: 'b',
      style: {
        'padding-left': 2,
        'padding-right': 0,
      },
    },
    {
      content: 'c',
      style: {
        'padding-left': 0,
      },
    },
    {
      content: 'd',
      style: {
        'padding-left': 0,
        'padding-right': 2,
      },
    },
  ]);

  const expected = [
    // prettier-disable
    '┌───────┬───┬──┬───┐',
    '│     a │  b│c │d  │',
    '└───────┴───┴──┴───┘',
  ].join('\n');
  expect(table.toString()).toEqual(expected);
});
