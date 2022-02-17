describe('Cell', function () {
  const colors = require('@colors/colors');
  const Cell = require('../src/cell');
  const { ColSpanCell, RowSpanCell } = Cell;
  const { mergeOptions } = require('../src/utils');

  function defaultOptions() {
    //overwrite coloring of head and border by default for easier testing.
    return mergeOptions({ style: { head: [], border: [] } });
  }

  function defaultChars() {
    return {
      top: '─',
      topMid: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottom: '─',
      bottomMid: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      left: '│',
      leftMid: '├',
      mid: '─',
      midMid: '┼',
      right: '│',
      rightMid: '┤',
      middle: '│',
    };
  }

  describe('constructor', function () {
    it('colSpan and rowSpan default to 1', function () {
      let cell = new Cell();
      expect(cell.colSpan).toEqual(1);
      expect(cell.rowSpan).toEqual(1);
    });

    it('colSpan and rowSpan can be set via constructor', function () {
      let cell = new Cell({ rowSpan: 2, colSpan: 3 });
      expect(cell.rowSpan).toEqual(2);
      expect(cell.colSpan).toEqual(3);
    });

    it('content can be set as a string', function () {
      let cell = new Cell('hello\nworld');
      expect(cell.content).toEqual('hello\nworld');
    });

    it('content can be set as a options property', function () {
      let cell = new Cell({ content: 'hello\nworld' });
      expect(cell.content).toEqual('hello\nworld');
    });

    it('default content is an empty string', function () {
      let cell = new Cell();
      expect(cell.content).toEqual('');
    });

    it('new Cell(null) will have empty string content', function () {
      let cell = new Cell(null);
      expect(cell.content).toEqual('');
    });

    it('new Cell({content: null}) will have empty string content', function () {
      let cell = new Cell({ content: null });
      expect(cell.content).toEqual('');
    });

    it('new Cell(0) will have "0" as content', function () {
      let cell = new Cell(0);
      expect(cell.content).toEqual('0');
    });

    it('new Cell({content: 0}) will have "0" as content', function () {
      let cell = new Cell({ content: 0 });
      expect(cell.content).toEqual('0');
    });

    it('new Cell(false) will have "false" as content', function () {
      let cell = new Cell(false);
      expect(cell.content).toEqual('false');
    });

    it('new Cell({content: false}) will have "false" as content', function () {
      let cell = new Cell({ content: false });
      expect(cell.content).toEqual('false');
    });
  });

  describe('mergeTableOptions', function () {
    describe('chars', function () {
      it('unset chars take on value of table', function () {
        let cell = new Cell();
        let tableOptions = defaultOptions();
        cell.mergeTableOptions(tableOptions);
        expect(cell.chars).toEqual(defaultChars());
      });

      it('set chars override the value of table', function () {
        let cell = new Cell({ chars: { bottomRight: '=' } });
        cell.mergeTableOptions(defaultOptions());
        let chars = defaultChars();
        chars.bottomRight = '=';
        expect(cell.chars).toEqual(chars);
      });

      it('hyphenated names will be converted to camel-case', function () {
        let cell = new Cell({ chars: { 'bottom-left': '=' } });
        cell.mergeTableOptions(defaultOptions());
        let chars = defaultChars();
        chars.bottomLeft = '=';
        expect(cell.chars).toEqual(chars);
      });
    });

    describe('truncate', function () {
      it('if unset takes on value of table', function () {
        let cell = new Cell();
        cell.mergeTableOptions(defaultOptions());
        expect(cell.truncate).toEqual('…');
      });

      it('if set overrides value of table', function () {
        let cell = new Cell({ truncate: '...' });
        cell.mergeTableOptions(defaultOptions());
        expect(cell.truncate).toEqual('...');
      });
    });

    describe('style.padding-left', function () {
      it('if unset will be copied from tableOptions.style', function () {
        let cell = new Cell();
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingLeft).toEqual(1);

        cell = new Cell();
        let tableOptions = defaultOptions();
        tableOptions.style['padding-left'] = 2;
        cell.mergeTableOptions(tableOptions);
        expect(cell.paddingLeft).toEqual(2);

        cell = new Cell();
        tableOptions = defaultOptions();
        tableOptions.style.paddingLeft = 3;
        cell.mergeTableOptions(tableOptions);
        expect(cell.paddingLeft).toEqual(3);
      });

      it('if set will override tableOptions.style', function () {
        let cell = new Cell({ style: { 'padding-left': 2 } });
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingLeft).toEqual(2);

        cell = new Cell({ style: { paddingLeft: 3 } });
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingLeft).toEqual(3);
      });
    });

    describe('style.padding-right', function () {
      it('if unset will be copied from tableOptions.style', function () {
        let cell = new Cell();
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingRight).toEqual(1);

        cell = new Cell();
        let tableOptions = defaultOptions();
        tableOptions.style['padding-right'] = 2;
        cell.mergeTableOptions(tableOptions);
        expect(cell.paddingRight).toEqual(2);

        cell = new Cell();
        tableOptions = defaultOptions();
        tableOptions.style.paddingRight = 3;
        cell.mergeTableOptions(tableOptions);
        expect(cell.paddingRight).toEqual(3);
      });

      it('if set will override tableOptions.style', function () {
        let cell = new Cell({ style: { 'padding-right': 2 } });
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingRight).toEqual(2);

        cell = new Cell({ style: { paddingRight: 3 } });
        cell.mergeTableOptions(defaultOptions());
        expect(cell.paddingRight).toEqual(3);
      });
    });

    describe('desiredWidth', function () {
      it('content(hello) padding(1,1) == 7', function () {
        let cell = new Cell('hello');
        cell.mergeTableOptions(defaultOptions());
        expect(cell.desiredWidth).toEqual(7);
      });

      it('content(hi) padding(1,2) == 5', function () {
        let cell = new Cell({ content: 'hi', style: { paddingRight: 2 } });
        let tableOptions = defaultOptions();
        cell.mergeTableOptions(tableOptions);
        expect(cell.desiredWidth).toEqual(5);
      });

      it('content(hi) padding(3,2) == 7', function () {
        let cell = new Cell({ content: 'hi', style: { paddingLeft: 3, paddingRight: 2 } });
        let tableOptions = defaultOptions();
        cell.mergeTableOptions(tableOptions);
        expect(cell.desiredWidth).toEqual(7);
      });
    });

    describe('desiredHeight', function () {
      it('1 lines of text', function () {
        let cell = new Cell('hi');
        cell.mergeTableOptions(defaultOptions());
        expect(cell.desiredHeight).toEqual(1);
      });

      it('2 lines of text', function () {
        let cell = new Cell('hi\nbye');
        cell.mergeTableOptions(defaultOptions());
        expect(cell.desiredHeight).toEqual(2);
      });

      it('2 lines of text', function () {
        let cell = new Cell('hi\nbye\nyo');
        cell.mergeTableOptions(defaultOptions());
        expect(cell.desiredHeight).toEqual(3);
      });
    });
  });

  describe('init', function () {
    describe('hAlign', function () {
      it('if unset takes colAlign value from tableOptions', function () {
        let tableOptions = defaultOptions();
        tableOptions.colAligns = ['left', 'right', 'both'];
        let cell = new Cell();
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('left');
        cell = new Cell();
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('right');
        cell = new Cell();
        cell.mergeTableOptions(tableOptions);
        cell.x = 2;
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('both');
      });

      it('if set overrides tableOptions', function () {
        let tableOptions = defaultOptions();
        tableOptions.colAligns = ['left', 'right', 'both'];
        let cell = new Cell({ hAlign: 'right' });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('right');
        cell = new Cell({ hAlign: 'left' });
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('left');
        cell = new Cell({ hAlign: 'right' });
        cell.x = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.hAlign).toEqual('right');
      });
    });

    describe('vAlign', function () {
      it('if unset takes rowAlign value from tableOptions', function () {
        let tableOptions = defaultOptions();
        tableOptions.rowAligns = ['top', 'bottom', 'center'];
        let cell = new Cell();
        cell.y = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('top');
        cell = new Cell();
        cell.y = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('bottom');
        cell = new Cell();
        cell.y = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('center');
      });

      it('if set overrides tableOptions', function () {
        let tableOptions = defaultOptions();
        tableOptions.rowAligns = ['top', 'bottom', 'center'];

        let cell = new Cell({ vAlign: 'bottom' });
        cell.y = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('bottom');

        cell = new Cell({ vAlign: 'top' });
        cell.y = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('top');

        cell = new Cell({ vAlign: 'center' });
        cell.y = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.vAlign).toEqual('center');
      });
    });

    describe('width', function () {
      it('will match colWidth of x', function () {
        let tableOptions = defaultOptions();
        tableOptions.colWidths = [5, 10, 15];

        let cell = new Cell();
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(5);

        cell = new Cell();
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(10);

        cell = new Cell();
        cell.x = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(15);
      });

      it('will add colWidths if colSpan > 1 with wordWrap false', function () {
        let tableOptions = defaultOptions();
        tableOptions.colWidths = [5, 10, 15];

        let cell = new Cell({ colSpan: 2 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(16);

        cell = new Cell({ colSpan: 2 });
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(26);

        cell = new Cell({ colSpan: 3 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(32);
      });

      it('will add colWidths if colSpan > 1 with wordWrap true', function () {
        let tableOptions = defaultOptions();
        tableOptions.colWidths = [5, 10, 15];
        tableOptions.wordWrap = true;

        let cell = new Cell({ colSpan: 2 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(16);

        cell = new Cell({ colSpan: 2 });
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(26);

        cell = new Cell({ colSpan: 3 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.width).toEqual(32);
      });

      it('will use multiple columns for wordWrap text when using colSpan and wordWrap together', function () {
        let tableOptions = defaultOptions();
        tableOptions.colWidths = [7, 7, 17];
        tableOptions.wordWrap = true;

        let cell = new Cell({ content: 'the quick brown fox', colSpan: 2 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.lines.length).toEqual(2);
        expect(cell.lines[0]).toContain('quick');
        expect(cell.lines[1]).toContain('fox');

        cell = new Cell({ content: 'the quick brown fox', colSpan: 2 });
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.lines.length).toEqual(1);
        expect(cell.lines[0]).toContain('fox');

        cell = new Cell({ content: 'the quick brown fox', colSpan: 3 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.lines.length).toEqual(1);
        expect(cell.lines[0]).toContain('fox');
      });

      it('will only use one column for wordWrap text when not using colSpan', function () {
        let tableOptions = defaultOptions();
        tableOptions.colWidths = [7, 7, 7];
        tableOptions.wordWrap = true;

        let cell = new Cell({ content: 'the quick brown fox' });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.lines.length).toEqual(4);
        expect(cell.lines[1]).toContain('quick');
        expect(cell.lines[3]).toContain('fox');
      });
    });

    describe('height', function () {
      it('will match rowHeight of x', function () {
        let tableOptions = defaultOptions();
        tableOptions.rowHeights = [5, 10, 15];

        let cell = new Cell();
        cell.y = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(5);

        cell = new Cell();
        cell.y = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(10);

        cell = new Cell();
        cell.y = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(15);
      });

      it('will add rowHeights if rowSpan > 1', function () {
        let tableOptions = defaultOptions();
        tableOptions.rowHeights = [5, 10, 15];

        let cell = new Cell({ rowSpan: 2 });
        cell.y = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(16);

        cell = new Cell({ rowSpan: 2 });
        cell.y = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(26);

        cell = new Cell({ rowSpan: 3 });
        cell.y = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.height).toEqual(32);
      });
    });

    describe('drawRight', function () {
      let tableOptions;

      beforeEach(function () {
        tableOptions = defaultOptions();
        tableOptions.colWidths = [20, 20, 20];
      });

      it('col 1 of 3, with default colspan', function () {
        let cell = new Cell();
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(false);
      });

      it('col 2 of 3, with default colspan', function () {
        let cell = new Cell();
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(false);
      });

      it('col 3 of 3, with default colspan', function () {
        let cell = new Cell();
        cell.x = 2;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(true);
      });

      it('col 3 of 4, with default colspan', function () {
        let cell = new Cell();
        cell.x = 2;
        tableOptions.colWidths = [20, 20, 20, 20];
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(false);
      });

      it('col 2 of 3, with colspan of 2', function () {
        let cell = new Cell({ colSpan: 2 });
        cell.x = 1;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(true);
      });

      it('col 1 of 3, with colspan of 3', function () {
        let cell = new Cell({ colSpan: 3 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(true);
      });

      it('col 1 of 3, with colspan of 2', function () {
        let cell = new Cell({ colSpan: 2 });
        cell.x = 0;
        cell.mergeTableOptions(tableOptions);
        cell.init(tableOptions);
        expect(cell.drawRight).toEqual(false);
      });
    });
  });

  describe('drawLine', function () {
    let cell;

    beforeEach(function () {
      cell = new Cell();

      //manually init
      cell.chars = defaultChars();
      cell.paddingLeft = cell.paddingRight = 1;
      cell.width = 7;
      cell.height = 3;
      cell.hAlign = 'center';
      cell.vAlign = 'center';
      cell.chars.left = 'L';
      cell.chars.right = 'R';
      cell.chars.middle = 'M';
      cell.content = 'hello\nhowdy\ngoodnight';
      cell.lines = cell.content.split('\n');
      cell.x = cell.y = 0;
    });

    describe('top line', function () {
      it('will draw the top left corner when x=0,y=0', function () {
        cell.x = cell.y = 0;
        expect(cell.draw('top')).toEqual('┌───────');
        cell.drawRight = true;
        expect(cell.draw('top')).toEqual('┌───────┐');
      });

      it('will draw the top mid corner when x=1,y=0', function () {
        cell.x = 1;
        cell.y = 0;
        expect(cell.draw('top')).toEqual('┬───────');
        cell.drawRight = true;
        expect(cell.draw('top')).toEqual('┬───────┐');
      });

      it('will draw the left mid corner when x=0,y=1', function () {
        cell.x = 0;
        cell.y = 1;
        expect(cell.draw('top')).toEqual('├───────');
        cell.drawRight = true;
        expect(cell.draw('top')).toEqual('├───────┤');
      });

      it('will draw the mid mid corner when x=1,y=1', function () {
        cell.x = 1;
        cell.y = 1;
        expect(cell.draw('top')).toEqual('┼───────');
        cell.drawRight = true;
        expect(cell.draw('top')).toEqual('┼───────┤');
      });

      it('will draw in the color specified by border style', function () {
        cell.border = ['gray'];
        expect(cell.draw('top')).toEqual(colors.gray('┌───────'));
      });
    });

    describe('bottom line', function () {
      it('will draw the bottom left corner if x=0', function () {
        cell.x = 0;
        cell.y = 1;
        expect(cell.draw('bottom')).toEqual('└───────');
        cell.drawRight = true;
        expect(cell.draw('bottom')).toEqual('└───────┘');
      });

      it('will draw the bottom left corner if x=1', function () {
        cell.x = 1;
        cell.y = 1;
        expect(cell.draw('bottom')).toEqual('┴───────');
        cell.drawRight = true;
        expect(cell.draw('bottom')).toEqual('┴───────┘');
      });

      it('will draw in the color specified by border style', function () {
        cell.border = ['gray'];
        expect(cell.draw('bottom')).toEqual(colors.gray('└───────'));
      });
    });

    describe('drawBottom', function () {
      it('draws an empty line', function () {
        expect(cell.drawEmpty()).toEqual('L       ');
        expect(cell.drawEmpty(true)).toEqual('L       R');
      });

      it('draws an empty line', function () {
        cell.border = ['gray'];
        cell.head = ['red'];
        expect(cell.drawEmpty()).toEqual(colors.gray('L') + colors.red('       '));
        expect(cell.drawEmpty(true)).toEqual(colors.gray('L') + colors.red('       ') + colors.gray('R'));
      });
    });

    describe('first line of text', function () {
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0', function () {
        cell.x = 0;
        expect(cell.draw(0)).toEqual('L  hello  ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('L  hello  R');
      });

      it('will draw mid side if x=1', function () {
        cell.x = 1;
        expect(cell.draw(0)).toEqual('M  hello  ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('M  hello  R');
      });

      it('will align left', function () {
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.draw(0)).toEqual('M hello   ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('M hello   R');
      });

      it('will align right', function () {
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.draw(0)).toEqual('M   hello ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('M   hello R');
      });

      it('left and right will be drawn in color of border style', function () {
        cell.border = ['gray'];
        cell.x = 0;
        expect(cell.draw(0)).toEqual(colors.gray('L') + '  hello  ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual(colors.gray('L') + '  hello  ' + colors.gray('R'));
      });

      it('text will be drawn in color of head style if y == 0', function () {
        cell.head = ['red'];
        cell.x = cell.y = 0;
        expect(cell.draw(0)).toEqual('L' + colors.red('  hello  '));
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('L' + colors.red('  hello  ') + 'R');
      });

      it('text will NOT be drawn in color of head style if y == 1', function () {
        cell.head = ['red'];
        cell.x = cell.y = 1;
        expect(cell.draw(0)).toEqual('M  hello  ');
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('M  hello  R');
      });

      it('head and border colors together', function () {
        cell.border = ['gray'];
        cell.head = ['red'];
        cell.x = cell.y = 0;
        expect(cell.draw(0)).toEqual(colors.gray('L') + colors.red('  hello  '));
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual(colors.gray('L') + colors.red('  hello  ') + colors.gray('R'));
      });
    });

    describe('second line of text', function () {
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0', function () {
        cell.x = 0;
        expect(cell.draw(1)).toEqual('L  howdy  ');
        cell.drawRight = true;
        expect(cell.draw(1)).toEqual('L  howdy  R');
      });

      it('will draw mid side if x=1', function () {
        cell.x = 1;
        expect(cell.draw(1)).toEqual('M  howdy  ');
        cell.drawRight = true;
        expect(cell.draw(1)).toEqual('M  howdy  R');
      });

      it('will align left', function () {
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.draw(1)).toEqual('M howdy   ');
        cell.drawRight = true;
        expect(cell.draw(1)).toEqual('M howdy   R');
      });

      it('will align right', function () {
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.draw(1)).toEqual('M   howdy ');
        cell.drawRight = true;
        expect(cell.draw(1)).toEqual('M   howdy R');
      });
    });

    describe('truncated line of text', function () {
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0', function () {
        cell.x = 0;
        expect(cell.draw(2)).toEqual('L goodni… ');
        cell.drawRight = true;
        expect(cell.draw(2)).toEqual('L goodni… R');
      });

      it('will draw mid side if x=1', function () {
        cell.x = 1;
        expect(cell.draw(2)).toEqual('M goodni… ');
        cell.drawRight = true;
        expect(cell.draw(2)).toEqual('M goodni… R');
      });

      it('will not change when aligned left', function () {
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.draw(2)).toEqual('M goodni… ');
        cell.drawRight = true;
        expect(cell.draw(2)).toEqual('M goodni… R');
      });

      it('will not change when aligned right', function () {
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.draw(2)).toEqual('M goodni… ');
        cell.drawRight = true;
        expect(cell.draw(2)).toEqual('M goodni… R');
      });
    });

    describe('vAlign', function () {
      beforeEach(function () {
        cell.height = '5';
      });

      it('center', function () {
        cell.vAlign = 'center';
        expect(cell.draw(0)).toEqual('L       ');
        expect(cell.draw(1)).toEqual('L hello ');
        expect(cell.draw(2)).toEqual('L howdy ');
        expect(cell.draw(3)).toEqual('L good… ');
        expect(cell.draw(4)).toEqual('L       ');

        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('L       R');
        expect(cell.draw(1)).toEqual('L hello R');
        expect(cell.draw(2)).toEqual('L howdy R');
        expect(cell.draw(3)).toEqual('L good… R');
        expect(cell.draw(4)).toEqual('L       R');

        cell.x = 1;
        cell.drawRight = false;
        expect(cell.draw(0)).toEqual('M       ');
        expect(cell.draw(1)).toEqual('M hello ');
        expect(cell.draw(2)).toEqual('M howdy ');
        expect(cell.draw(3)).toEqual('M good… ');
        expect(cell.draw(4)).toEqual('M       ');
      });

      it('top', function () {
        cell.vAlign = 'top';
        expect(cell.draw(0)).toEqual('L hello ');
        expect(cell.draw(1)).toEqual('L howdy ');
        expect(cell.draw(2)).toEqual('L good… ');
        expect(cell.draw(3)).toEqual('L       ');
        expect(cell.draw(4)).toEqual('L       ');

        cell.vAlign = null; //top is the default
        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('L hello R');
        expect(cell.draw(1)).toEqual('L howdy R');
        expect(cell.draw(2)).toEqual('L good… R');
        expect(cell.draw(3)).toEqual('L       R');
        expect(cell.draw(4)).toEqual('L       R');

        cell.x = 1;
        cell.drawRight = false;
        expect(cell.draw(0)).toEqual('M hello ');
        expect(cell.draw(1)).toEqual('M howdy ');
        expect(cell.draw(2)).toEqual('M good… ');
        expect(cell.draw(3)).toEqual('M       ');
        expect(cell.draw(4)).toEqual('M       ');
      });

      it('center', function () {
        cell.vAlign = 'bottom';
        expect(cell.draw(0)).toEqual('L       ');
        expect(cell.draw(1)).toEqual('L       ');
        expect(cell.draw(2)).toEqual('L hello ');
        expect(cell.draw(3)).toEqual('L howdy ');
        expect(cell.draw(4)).toEqual('L good… ');

        cell.drawRight = true;
        expect(cell.draw(0)).toEqual('L       R');
        expect(cell.draw(1)).toEqual('L       R');
        expect(cell.draw(2)).toEqual('L hello R');
        expect(cell.draw(3)).toEqual('L howdy R');
        expect(cell.draw(4)).toEqual('L good… R');

        cell.x = 1;
        cell.drawRight = false;
        expect(cell.draw(0)).toEqual('M       ');
        expect(cell.draw(1)).toEqual('M       ');
        expect(cell.draw(2)).toEqual('M hello ');
        expect(cell.draw(3)).toEqual('M howdy ');
        expect(cell.draw(4)).toEqual('M good… ');
      });
    });

    it('vertically truncated will show truncation on last visible line', function () {
      cell.height = 2;
      expect(cell.draw(0)).toEqual('L hello ');
      expect(cell.draw(1)).toEqual('L howd… ');
    });

    it("won't vertically truncate if the lines just fit", function () {
      cell.height = 2;
      cell.content = 'hello\nhowdy';
      cell.lines = cell.content.split('\n');
      expect(cell.draw(0)).toEqual('L hello ');
      expect(cell.draw(1)).toEqual('L howdy ');
    });

    it('will vertically truncate even if last line is short', function () {
      cell.height = 2;
      cell.content = 'hello\nhi\nhowdy';
      cell.lines = cell.content.split('\n');
      expect(cell.draw(0)).toEqual('L hello ');
      expect(cell.draw(1)).toEqual('L  hi…  ');
    });

    it('allows custom truncation', function () {
      cell.height = 2;
      cell.truncate = '...';
      cell.content = 'hello\nhi\nhowdy';
      cell.lines = cell.content.split('\n');
      expect(cell.draw(0)).toEqual('L hello ');
      expect(cell.draw(1)).toEqual('L hi... ');

      cell.content = 'hello\nhowdy\nhi';
      cell.lines = cell.content.split('\n');
      expect(cell.draw(0)).toEqual('L hello ');
      expect(cell.draw(1)).toEqual('L ho... ');
    });
  });

  describe('ColSpanCell', function () {
    it('has an init function', function () {
      expect(new ColSpanCell()).toHaveProperty('init');
      new ColSpanCell().init(); // nothing happens.
    });

    it('draw returns an empty string', function () {
      expect(new ColSpanCell().draw('top')).toEqual('');
      expect(new ColSpanCell().draw('bottom')).toEqual('');
      expect(new ColSpanCell().draw(1)).toEqual('');
    });
  });

  describe('RowSpanCell', function () {
    let original, tableOptions;

    beforeEach(function () {
      original = {
        rowSpan: 3,
        y: 0,
        draw: jest.fn(),
      };
      tableOptions = {
        rowHeights: [2, 3, 4, 5],
      };
    });

    it('drawing top of the next row', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 1;
      spanner.init(tableOptions);
      spanner.draw('top');
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(2, 1);
    });

    it('drawing line 0 of the next row', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 1;
      spanner.init(tableOptions);
      spanner.draw(0);
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(3);
    });

    it('drawing line 1 of the next row', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 1;
      spanner.init(tableOptions);
      spanner.draw(1);
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(4);
    });

    it('drawing top of two rows below', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 2;
      spanner.init(tableOptions);
      spanner.draw('top');
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(6, 2);
    });

    it('drawing line 0 of two rows below', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 2;
      spanner.init(tableOptions);
      spanner.draw(0);
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(7);
    });

    it('drawing line 1 of two rows below', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 2;
      spanner.init(tableOptions);
      spanner.draw(1);
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith(8);
    });

    it('drawing bottom', function () {
      let spanner = new RowSpanCell(original);
      spanner.x = 0;
      spanner.y = 1;
      spanner.init(tableOptions);
      spanner.draw('bottom');
      expect(original.draw).toHaveBeenCalledTimes(1);
      expect(original.draw).toHaveBeenCalledWith('bottom');
    });
  });
});
