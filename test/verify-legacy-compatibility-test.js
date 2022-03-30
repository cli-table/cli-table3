jest.mock('colors/safe', () => jest.requireActual('@colors/colors/safe'));
(function () {
  describe('verify original cli-table behavior', function () {
    commonTests(require('cli-table'));
  });

  describe('@api cli-table2 matches verified behavior', function () {
    commonTests(require('../src/table'));
  });

  function commonTests(Table) {
    const colors = require('@colors/colors/safe');

    it('empty table has a width of 0', function () {
      let table = new Table();
      expect(table.width).toEqual(0);
      expect(table.toString()).toEqual('');
    });

    it('header text will be colored according to style', function () {
      let table = new Table({ head: ['hello', 'goodbye'], style: { border: [], head: ['red', 'bgWhite'] } });

      let expected = [
        '┌───────┬─────────┐',
        '│' + colors.bgWhite.red(' hello ') + '│' + colors.bgWhite.red(' goodbye ') + '│',
        '└───────┴─────────┘',
      ];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('tables with one row of data will not be treated as headers', function () {
      let table = new Table({ style: { border: [], head: ['red'] } });

      table.push(['hello', 'goodbye']);

      let expected = ['┌───────┬─────────┐', '│ hello │ goodbye │', '└───────┴─────────┘'];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('table with headers and data headers', function () {
      let table = new Table({ head: ['hello', 'goodbye'], style: { border: [], head: ['red'] } });

      table.push(['hola', 'adios']);

      let expected = [
        '┌───────┬─────────┐',
        '│' + colors.red(' hello ') + '│' + colors.red(' goodbye ') + '│',
        '├───────┼─────────┤',
        '│ hola  │ adios   │',
        '└───────┴─────────┘',
      ];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('compact shorthand', function () {
      let table = new Table({ style: { compact: true, border: [], head: ['red'] } });

      table.push(['hello', 'goodbye'], ['hola', 'adios']);

      let expected = ['┌───────┬─────────┐', '│ hello │ goodbye │', '│ hola  │ adios   │', '└───────┴─────────┘'];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('compact shorthand - headers are still rendered with separator', function () {
      let table = new Table({ head: ['hello', 'goodbye'], style: { compact: true, border: [], head: [] } });

      table.push(['hola', 'adios'], ['hi', 'bye']);

      let expected = [
        '┌───────┬─────────┐',
        '│ hello │ goodbye │',
        '├───────┼─────────┤',
        '│ hola  │ adios   │',
        '│ hi    │ bye     │',
        '└───────┴─────────┘',
      ];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('compact longhand - headers are not rendered with separator', function () {
      let table = new Table({
        chars: {
          mid: '',
          'left-mid': '',
          'mid-mid': '',
          'right-mid': '',
        },
        head: ['hello', 'goodbye'],
        style: { border: [], head: [] },
      });

      table.push(['hola', 'adios'], ['hi', 'bye']);

      let expected = [
        '┌───────┬─────────┐',
        '│ hello │ goodbye │',
        '│ hola  │ adios   │',
        '│ hi    │ bye     │',
        '└───────┴─────────┘',
      ];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('compact longhand', function () {
      let table = new Table({
        chars: {
          mid: '',
          'left-mid': '',
          'mid-mid': '',
          'right-mid': '',
        },
        style: { border: [], head: ['red'] },
      });

      table.push(['hello', 'goodbye'], ['hola', 'adios']);

      let expected = ['┌───────┬─────────┐', '│ hello │ goodbye │', '│ hola  │ adios   │', '└───────┴─────────┘'];

      expect(table.toString()).toEqual(expected.join('\n'));
    });

    it('objects with multiple properties in a cross-table', function () {
      let table = new Table({ style: { border: [], head: [] } });

      table.push(
        { a: ['b'], c: ['d'] } // value of property 'c' will be discarded
      );

      let expected = ['┌───┬───┐', '│ a │ b │', '└───┴───┘'];
      expect(table.toString()).toEqual(expected.join('\n'));
    });
  }
})();
