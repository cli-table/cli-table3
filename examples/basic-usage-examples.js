const Table = require('../src/table');
const colors = require('@colors/colors/safe');
const { hyperlink } = require('../src/utils');

// prettier-ignore
// Disable prettier so that examples are formatted more clearly

module.exports = function (runTest) {
  function it(name, fn) {
    let result = fn();
    runTest(name, result[0], result[1], result[2]);
  }

  it('Basic Usage', function () {
    function makeTable() {
      // By default, headers will be red, and borders will be grey
      let table = new Table({ head: ['a', 'b'] });

      table.push(['c', 'd']);

      return table;
    }

    let expected = [
      colors.gray('┌───') + colors.gray('┬───┐'),
      colors.gray('│') + colors.red(' a ') + colors.gray('│') + colors.red(' b ') + colors.gray('│'),
      colors.gray('├───') + colors.gray('┼───┤'),
      colors.gray('│') + ' c ' + colors.gray('│') + ' d ' + colors.gray('│'),
      colors.gray('└───') + colors.gray('┴───┘'),
    ];

    return [makeTable, expected, 'basic-usage-with-colors'];
  });

  it('Basic Usage - disable colors - (used often in the examples and tests)', function () {
    function makeTable() {
      // For most of these examples, and most of the unit tests we disable colors.
      // It makes unit tests easier to write/understand, and allows these pages to
      // display the examples as text instead of screen shots.
      let table = new Table({
        head: ['Rel', 'Change', 'By', 'When'],
        style: {
          head: [], //disable colors in header cells
          border: [], //disable colors for the border
        },
        colWidths: [6, 21, 25, 17], //set the widths of each column (optional)
      });

      table.push(
        ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago'],
        ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
      );

      return table;
    }

    let expected = [
      '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐',
      '│ Rel  │ Change              │ By                      │ When            │',
      '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤',
      '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │',
      '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤',
      '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │',
      '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘',
    ];

    return [makeTable, expected];
  });

  it('Create vertical tables by adding objects a that specify key-value pairs', function () {
    function makeTable() {
      let table = new Table({
        style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
      });

      table.push(
        { 'v0.1': 'Testing something cool' },
        { 'v0.1': 'Testing something cool' }
      );

      return table;
    }

    let expected = [
      '┌────┬──────────────────────┐',
      '│v0.1│Testing something cool│',
      '├────┼──────────────────────┤',
      '│v0.1│Testing something cool│',
      '└────┴──────────────────────┘',
    ];

    return [makeTable, expected];
  });

  it('Cross tables are similar to vertical tables, but include an empty string for the first header', function () {
    function makeTable() {
      let table = new Table({
        head: ['', 'Header 1', 'Header 2'],
        style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
      }); // clear styles to prevent color output

      table.push(
        { 'Header 3': ['v0.1', 'Testing something cool'] },
        { 'Header 4': ['v0.1', 'Testing something cool'] }
      );

      return table;
    }

    let expected = [
      '┌────────┬────────┬──────────────────────┐',
      '│        │Header 1│Header 2              │',
      '├────────┼────────┼──────────────────────┤',
      '│Header 3│v0.1    │Testing something cool│',
      '├────────┼────────┼──────────────────────┤',
      '│Header 4│v0.1    │Testing something cool│',
      '└────────┴────────┴──────────────────────┘',
    ];

    return [makeTable, expected];
  });

  it('Stylize the table with custom border characters', function () {
    function makeTable() {
      let table = new Table({
        chars: {
          top: '═',
          'top-mid': '╤',
          'top-left': '╔',
          'top-right': '╗',
          bottom: '═',
          'bottom-mid': '╧',
          'bottom-left': '╚',
          'bottom-right': '╝',
          left: '║',
          'left-mid': '╟',
          right: '║',
          'right-mid': '╢',
        },
        style: {
          head: [],
          border: [],
        },
      });

      table.push(
        ['foo', 'bar', 'baz'],
        ['frob', 'bar', 'quuz']
      );

      return table;
    }

    let expected = [
      '╔══════╤═════╤══════╗',
      '║ foo  │ bar │ baz  ║',
      '╟──────┼─────┼──────╢',
      '║ frob │ bar │ quuz ║',
      '╚══════╧═════╧══════╝',
    ];

    return [makeTable, expected];
  });

  it('Use ansi colors (i.e. colors.js) to style text within the cells at will, even across multiple lines', function () {
    function makeTable() {
      let table = new Table({ style: { border: [], header: [] } });

      table.push([colors.red('Hello\nhow\nare\nyou?'), colors.blue('I\nam\nfine\nthanks!')]);

      return table;
    }

    let expected = [
      '┌───────┬─────────┐',
      '│ ' + colors.red('Hello') + ' │ ' + colors.blue('I') + '       │',
      '│ ' + colors.red('how') + '   │ ' + colors.blue('am') + '      │',
      '│ ' + colors.red('are') + '   │ ' + colors.blue('fine') + '    │',
      '│ ' + colors.red('you?') + '  │ ' + colors.blue('thanks!') + ' │',
      '└───────┴─────────┘',
    ];

    return [makeTable, expected, 'multi-line-colors'];
  });

  it('Set `wordWrap` to true to wrap text on word boundaries', function () {
    function makeTable() {
      let table = new Table({
        style: { border: [], header: [] },
        colWidths: [7, 9], // Requires fixed column widths
        wordWrap: true,
      });

      table.push([
        'Hello how are you?',
        'I am fine thanks! Looooooong',
        ['Words that exceed', 'the colWidth will', 'be truncated.'].join('\n'),
        ['Text is only', 'wrapped for', 'fixed width', 'columns.'].join('\n'),
      ]);

      return table;
    }

    let expected = [
      '┌───────┬─────────┬───────────────────┬──────────────┐',
      '│ Hello │ I am    │ Words that exceed │ Text is only │',
      '│ how   │ fine    │ the colWidth will │ wrapped for  │',
      '│ are   │ thanks! │ be truncated.     │ fixed width  │',
      '│ you?  │ Looooo… │                   │ columns.     │',
      '└───────┴─────────┴───────────────────┴──────────────┘',
    ];

    return [makeTable, expected];
  });

  it('Using `wordWrap`, set `wrapOnWordBoundary` to false to ignore word boundaries', function () {
    function makeTable() {
      const table = new Table({
        style: { border: [], header: [] },
        colWidths: [3, 3], // colWidths must all be greater than 2!!!!
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      table.push(['Wrap', 'Text']);
      return table;
    }

    let expected = [
      '┌───┬───┐',
      '│ W │ T │',
      '│ r │ e │',
      '│ a │ x │',
      '│ p │ t │',
      '└───┴───┘',
    ];

    return [makeTable, expected];
  });

  it('Supports hyperlinking cell content using the href option', () => {
    function link(text) {
      return hyperlink('http://example.com', text);
    }
    function makeTable() {
      const table = new Table({
        colWidths: [11, 5, 5],
        style: { border: [], head: [] },
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      const href = 'http://example.com';
      table.push(
        [{ content: 'Text Link', href }, { content: 'Hello Link', href }, { href }],
        [{ href, colSpan: 3 }]
      );
      return table;
    }

    let expected = [
      '┌───────────┬─────┬─────┐',
      `│ ${link('Text Link')} │ ${link('Hel')} │ ${link('htt')} │`,
      `│           │ ${link('lo ')} │ ${link('p:/')} │`,
      `│           │ ${link('Lin')} │ ${link('/ex')} │`,
      `│           │ ${link('k')}   │ ${link('amp')} │`,
      `│           │     │ ${link('le.')} │`,
      `│           │     │ ${link('com')} │`,
      '├───────────┴─────┴─────┤',
      `│ ${link('http://example.com')}    │`,
      '└───────────────────────┘',
    ];
    return [makeTable, expected];
  });
};

/* Expectation - ready to be copy/pasted and filled in. DO NOT DELETE THIS


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
// Jest Snapshot v1, https://goo.gl/fbAQLP
