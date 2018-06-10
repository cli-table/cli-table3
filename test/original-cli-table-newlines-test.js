describe('@api original-cli-table newline tests', function() {
  const Table = require('../src/table');

  it('test table with newlines in headers', function() {
    let table = new Table({
      head: ['Test', '1\n2\n3'],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: [],
        border: [],
      },
    });

    let expected = ['┌──────┬───┐', '│ Test │ 1 │', '│      │ 2 │', '│      │ 3 │', '└──────┴───┘'];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('test column width is accurately reflected when newlines are present', function() {
    let table = new Table({ head: ['Test\nWidth'], style: { head: [], border: [] } });
    expect(table.width).toEqual(9);
  });

  it('test newlines in body cells', function() {
    let table = new Table({ style: { head: [], border: [] } });

    table.push(['something\nwith\nnewlines']);

    let expected = ['┌───────────┐', '│ something │', '│ with      │', '│ newlines  │', '└───────────┘'];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('test newlines in vertical cell header and body', function() {
    let table = new Table({ style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] } });

    table.push({ 'v\n0.1': 'Testing\nsomething cool' });

    let expected = ['┌───┬──────────────┐', '│v  │Testing       │', '│0.1│something cool│', '└───┴──────────────┘'];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('test newlines in cross table header and body', function() {
    let table = new Table({
      head: ['', 'Header\n1'],
      style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
    });

    table.push({ 'Header\n2': ['Testing\nsomething\ncool'] });

    let expected = [
      '┌──────┬─────────┐',
      '│      │Header   │',
      '│      │1        │',
      '├──────┼─────────┤',
      '│Header│Testing  │',
      '│2     │something│',
      '│      │cool     │',
      '└──────┴─────────┘',
    ];

    expect(table.toString()).toEqual(expected.join('\n'));
  });
});
