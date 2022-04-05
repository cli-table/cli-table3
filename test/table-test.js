describe('@api Table ', function () {
  const Table = require('..');
  const colors = require('@colors/colors/safe');

  it('wordWrap with colored text', function () {
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

  it('allows numbers as `content` property of cells defined using object notation', function () {
    let table = new Table({ style: { border: [], head: [] } });

    table.push([{ content: 12 }]);

    let expected = ['┌────┐', '│ 12 │', '└────┘'];

    expect(table.toString()).toEqual(expected.join('\n'));
  });

  it('throws if content is not a string or number', function () {
    let table = new Table({ style: { border: [], head: [] } });

    expect(function () {
      table.push([{ content: { a: 'b' } }]);
      table.toString();
    }).toThrow();
  });

  it('works with CJK values', function () {
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

  it('supports complex layouts', () => {
    let table = new Table({ style: { border: [], head: [] } });
    table.push(
      [{ content: 'TOP', colSpan: 9, hAlign: 'center' }],
      [
        { content: 'TL', rowSpan: 4, vAlign: 'center' },
        { content: 'A1', rowSpan: 3 },
        'B1',
        'C1',
        { content: 'D1', rowSpan: 3, vAlign: 'center' },
        'E1',
        'F1',
        { content: 'G1', rowSpan: 3 },
        { content: 'TR', rowSpan: 4, vAlign: 'center' },
      ],
      [{ rowSpan: 2, content: 'B2' }, 'C2', { rowSpan: 2, colSpan: 2, content: 'E2' }],
      ['C3'],
      [{ content: 'A2', colSpan: 7, hAlign: 'center' }],
      [{ content: 'CLEAR', colSpan: 9, hAlign: 'center' }],
      [
        { content: 'BL', rowSpan: 4, vAlign: 'center' },
        { content: 'A3', colSpan: 7, hAlign: 'center' },
        { content: 'BR', rowSpan: 4, vAlign: 'center' },
      ],
      [
        { content: 'A4', colSpan: 3, hAlign: 'center' },
        { content: 'D2', rowSpan: 2, vAlign: 'center' },
        { content: 'E3', colSpan: 2, hAlign: 'center' },
        { content: 'G2', rowSpan: 3, vAlign: 'center' },
      ],
      [
        { content: 'A5', rowSpan: 2, vAlign: 'center' },
        { content: 'B3', colSpan: 2, hAlign: 'center' },
        { content: 'E4', rowSpan: 2, vAlign: 'center' },
        { content: 'F3', rowSpan: 2, vAlign: 'center' },
      ],
      ['B4', { content: 'C4', colSpan: 2, hAlign: 'center' }],
      [{ content: 'BOTTOM', colSpan: 9, hAlign: 'center' }]
    );
    let expected = [
      '┌────────────────────────────────────────────┐',
      '│                    TOP                     │',
      '├────┬────┬────┬────┬────┬────┬────┬────┬────┤',
      '│    │ A1 │ B1 │ C1 │    │ E1 │ F1 │ G1 │    │',
      '│    │    ├────┼────┤    ├────┴────┤    │    │',
      '│    │    │ B2 │ C2 │ D1 │ E2      │    │    │',
      '│ TL │    │    ├────┤    │         │    │ TR │',
      '│    │    │    │ C3 │    │         │    │    │',
      '│    ├────┴────┴────┴────┴─────────┴────┤    │',
      '│    │                A2                │    │',
      '├────┴──────────────────────────────────┴────┤',
      '│                   CLEAR                    │',
      '├────┬──────────────────────────────────┬────┤',
      '│    │                A3                │    │',
      '│    ├──────────────┬────┬─────────┬────┤    │',
      '│    │      A4      │    │   E3    │    │    │',
      '│ BL ├────┬─────────┤ D2 ├────┬────┤    │ BR │',
      '│    │    │   B3    │    │    │    │ G2 │    │',
      '│    │ A5 ├────┬────┴────┤ E4 │ F3 │    │    │',
      '│    │    │ B4 │   C4    │    │    │    │    │',
      '├────┴────┴────┴─────────┴────┴────┴────┴────┤',
      '│                   BOTTOM                   │',
      '└────────────────────────────────────────────┘',
    ];
    expect(table.toString()).toEqual(expected.join('\n'));
  });
  describe('debugging', () => {
    afterEach(() => Table.reset());
    it('is not accessible when disabled', () => {
      let table = new Table();
      expect(table.messages).toBeUndefined();
    });
    it('warns of missing cells', () => {
      let table = new Table({ debug: true });
      table.push([{ rowSpan: 2 }], [{}]);
      table.toString();
      expect(table.messages).toEqual(['Missing cell at 0-1.']);
    });
    it('provides cell info', () => {
      let table = new Table({ debug: 2 });
      table.push(['a', 'b', { content: 'c', rowSpan: 2 }], [{ content: 'd', colSpan: 2 }]);
      table.toString();
      expect(table.messages).toContain('0-0: 1x1 Cell a');
      expect(table.messages).toContain('0-1: 1x1 Cell b');
      expect(table.messages).toContain('0-2: 2x1 Cell c');
      expect(table.messages).toContain('1-0: 1x2 Cell d');
    });
    it('provides rowSpan and colSpan cell debug info', () => {
      let table = new Table({ debug: 3 });
      table.push(['a', 'b', { content: 'c', rowSpan: 2 }], [{ content: 'd', colSpan: 2 }]);
      table.toString();
      expect(table.messages).toContain('1-1: 1x1 ColSpanCell');
      expect(table.messages).toContain('1-2: 1x1 RowSpanCell for c');
    });
    it('provides debug info', () => {
      let table = new Table({ debug: 3 });
      table.push([{}, {}], [{}, {}]);
      table.toString();
      expect(table.messages).toContain('Max rows: 2; Max cols: 2');
    });
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
