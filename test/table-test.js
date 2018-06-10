describe('@api Table ', function() {
  const Table = require('..');
  const colors = require('colors/safe');

  it('wordWrap with colored text', function() {
    let table = new Table({ style: { border: [], head: [] }, wordWrap: true, colWidths: [7, 9] });

    table.push([colors.red('Hello how are you?'), colors.blue('I am fine thanks!')]);

    let expected = [
      '┌───────┬─────────┐',
      '│ ' + colors.red('Hello') + ' │ ' + colors.blue('I am') + '    │',
      '│ ' + colors.red('how') + '   │ ' + colors.blue('fine') + '    │',
      '│ ' + colors.red('are') + '   │ ' + colors.blue('thanks!') + ' │',
      '│ ' + colors.red('you?') + '  │         │',
      '└───────┴─────────┘',
    ];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('allows numbers as `content` property of cells defined using object notation', function() {
    let table = new Table({ style: { border: [], head: [] } });

    table.push([{ content: 12 }]);

    let expected = ['┌────┐', '│ 12 │', '└────┘'];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('throws if content is not a string or number', function() {
    let table = new Table({ style: { border: [], head: [] } });

    expect(function() {
      table.push([{ content: { a: 'b' } }]);
      table.toString();
    }).toThrow();
  });

  it('works with CJK values', function() {
    let table = new Table({ style: { border: [], head: [] }, colWidths: [5, 10, 5] });

    table.push(
      ['foobar', 'English test', 'baz'],
      ['foobar', '中文测试', 'baz'],
      ['foobar', '日本語テスト', 'baz'],
      ['foobar', '한국어테스트', 'baz']
    );

    let expected = [
      '┌─────┬──────────┬─────┐',
      '│ fo… │ English… │ baz │',
      '├─────┼──────────┼─────┤',
      '│ fo… │ 中文测试 │ baz │',
      '├─────┼──────────┼─────┤',
      '│ fo… │ 日本語…  │ baz │',
      '├─────┼──────────┼─────┤',
      '│ fo… │ 한국어…  │ baz │',
      '└─────┴──────────┴─────┘',
    ];

    expect(table.toString()).toEqual(expected.join('\n'));
  });
});

/*

 let expected = [
   '┌──┬───┬──┬──┐'
 , '│  │   │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '└──┴───┴──┴──┘'
 ];

 */
