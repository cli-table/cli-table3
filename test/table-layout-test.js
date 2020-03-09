describe('tableLayout', function() {
  const Cell = require('../src/cell');
  const layoutManager = require('../src/layout-manager');
  const { makeTableLayout, addRowSpanCells, fillInTable, computeWidths, computeHeights } = layoutManager;

  it('simple 2x2 layout', function() {
    let actual = makeTableLayout([['hello', 'goodbye'], ['hola', 'adios']]);

    let expected = [['hello', 'goodbye'], ['hola', 'adios']];

    checkLayout(actual, expected);
  });

  it('cross table', function() {
    let actual = makeTableLayout([{ '1.0': ['yes', 'no'] }, { '2.0': ['hello', 'goodbye'] }]);

    let expected = [['1.0', 'yes', 'no'], ['2.0', 'hello', 'goodbye']];

    checkLayout(actual, expected);
  });

  it('vertical table', function() {
    let actual = makeTableLayout([{ '1.0': 'yes' }, { '2.0': 'hello' }]);

    let expected = [['1.0', 'yes'], ['2.0', 'hello']];

    checkLayout(actual, expected);
  });

  it('colSpan adds RowSpanCells to the right', function() {
    let actual = makeTableLayout([[{ content: 'hello', colSpan: 2 }], ['hola', 'adios']]);

    let expected = [[{ content: 'hello', colSpan: 2 }, null], ['hola', 'adios']];

    checkLayout(actual, expected);
  });

  it('rowSpan adds RowSpanCell below', function() {
    let actual = makeTableLayout([[{ content: 'hello', rowSpan: 2 }, 'goodbye'], ['adios']]);

    let expected = [['hello', 'goodbye'], [{ spannerFor: [0, 0] }, 'adios']];

    checkLayout(actual, expected);
  });

  it('rowSpan and cellSpan together', function() {
    let actual = makeTableLayout([[{ content: 'hello', rowSpan: 2, colSpan: 2 }, 'goodbye'], ['adios']]);

    let expected = [['hello', null, 'goodbye'], [{ spannerFor: [0, 0] }, null, 'adios']];

    checkLayout(actual, expected);
  });

  it('complex layout', function() {
    let actual = makeTableLayout([
      [{ content: 'hello', rowSpan: 2, colSpan: 2 }, { content: 'yo', rowSpan: 2, colSpan: 2 }, 'goodbye'],
      ['adios'],
    ]);

    let expected = [
      ['hello', null, 'yo', null, 'goodbye'],
      [{ spannerFor: [0, 0] }, null, { spannerFor: [0, 2] }, null, 'adios'],
    ];

    checkLayout(actual, expected);
  });

  it('complex layout2', function() {
    let actual = makeTableLayout([
      ['a', 'b', { content: 'c', rowSpan: 3, colSpan: 2 }, 'd'],
      [{ content: 'e', rowSpan: 2, colSpan: 2 }, 'f'],
      ['g'],
    ]);

    let expected = [
      ['a', 'b', 'c', null, 'd'],
      ['e', null, { spannerFor: [0, 2] }, null, 'f'],
      [{ spannerFor: [1, 0] }, null, { spannerFor: [0, 2] }, null, 'g'],
    ];

    checkLayout(actual, expected);
  });

  it('stairstep spans', function() {
    let actual = makeTableLayout([[{ content: '', rowSpan: 2 }, ''], [{ content: '', rowSpan: 2 }], ['']]);

    let expected = [
      [{ content: '', rowSpan: 2 }, ''],
      [{ spannerFor: [0, 0] }, { content: '', rowSpan: 2 }],
      ['', { spannerFor: [1, 1] }],
    ];

    checkLayout(actual, expected);
  });

  describe('fillInTable', function() {
    function mc(opts, y, x) {
      let cell = new Cell(opts);
      cell.x = x;
      cell.y = y;
      return cell;
    }

    it('will blank out individual cells', function() {
      let cells = [[mc('a', 0, 1)], [mc('b', 1, 0)]];
      fillInTable(cells);

      checkLayout(cells, [['', 'a'], ['b', '']]);
    });

    it('will autospan to the right', function() {
      let cells = [[], [mc('a', 1, 1)]];
      fillInTable(cells);

      checkLayout(cells, [[{ content: '', colSpan: 2 }, null], ['', 'a']]);
    });

    it('will autospan down', function() {
      let cells = [[mc('a', 0, 1)], []];
      fillInTable(cells);
      addRowSpanCells(cells);

      checkLayout(cells, [[{ content: '', rowSpan: 2 }, 'a'], [{ spannerFor: [0, 0] }, '']]);
    });

    it('will autospan right and down', function() {
      let cells = [[mc('a', 0, 2)], [], [mc('b', 2, 1)]];
      fillInTable(cells);
      addRowSpanCells(cells);

      checkLayout(cells, [
        [{ content: '', colSpan: 2, rowSpan: 2 }, null, 'a'],
        [{ spannerFor: [0, 0] }, null, { content: '', colSpan: 1, rowSpan: 2 }],
        ['', 'b', { spannerFor: [1, 2] }],
      ]);
    });
  });

  describe('computeWidths', function() {
    function mc(y, x, desiredWidth, colSpan) {
      return { x: x, y: y, desiredWidth: desiredWidth, colSpan: colSpan };
    }

    it('finds the maximum desired width of each column', function() {
      let widths = [];
      let cells = [
        [mc(0, 0, 7), mc(0, 1, 3), mc(0, 2, 5)],
        [mc(1, 0, 8), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 6), mc(2, 1, 9), mc(2, 2, 1)],
      ];

      computeWidths(widths, cells);

      expect(widths).toEqual([8, 9, 5]);
    });

    it("won't touch hard coded values", function() {
      let widths = [null, 3];
      let cells = [
        [mc(0, 0, 7), mc(0, 1, 3), mc(0, 2, 5)],
        [mc(1, 0, 8), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 6), mc(2, 1, 9), mc(2, 2, 1)],
      ];

      computeWidths(widths, cells);

      expect(widths).toEqual([8, 3, 5]);
    });

    it('assumes undefined desiredWidth is 1', function() {
      let widths = [];
      let cells = [[{ x: 0, y: 0 }], [{ x: 0, y: 1 }], [{ x: 0, y: 2 }]];
      computeWidths(widths, cells);
      expect(widths).toEqual([1]);
    });

    it('takes into account colSpan and wont over expand', function() {
      let widths = [];
      let cells = [
        [mc(0, 0, 10, 2), mc(0, 2, 5)],
        [mc(1, 0, 5), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)],
      ];
      computeWidths(widths, cells);
      expect(widths).toEqual([5, 5, 5]);
    });

    it('will expand rows involved in colSpan in a balanced way', function() {
      let widths = [];
      let cells = [
        [mc(0, 0, 13, 2), mc(0, 2, 5)],
        [mc(1, 0, 5), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)],
      ];
      computeWidths(widths, cells);
      expect(widths).toEqual([6, 6, 5]);
    });

    it('expands across 3 cols', function() {
      let widths = [];
      let cells = [[mc(0, 0, 25, 3)], [mc(1, 0, 5), mc(1, 1, 5), mc(1, 2, 2)], [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)]];
      computeWidths(widths, cells);
      expect(widths).toEqual([9, 9, 5]);
    });

    it('multiple spans in same table', function() {
      let widths = [];
      let cells = [[mc(0, 0, 25, 3)], [mc(1, 0, 30, 3)], [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)]];
      computeWidths(widths, cells);
      expect(widths).toEqual([11, 9, 8]);
    });

    it('spans will only edit uneditable tables', function() {
      let widths = [null, 3];
      let cells = [[mc(0, 0, 20, 3)], [mc(1, 0, 4), mc(1, 1, 20), mc(1, 2, 5)]];
      computeWidths(widths, cells);
      expect(widths).toEqual([7, 3, 8]);
    });

    it('spans will only edit uneditable tables - first column uneditable', function() {
      let widths = [3];
      let cells = [[mc(0, 0, 20, 3)], [mc(1, 0, 4), mc(1, 1, 3), mc(1, 2, 5)]];
      computeWidths(widths, cells);
      expect(widths).toEqual([3, 7, 8]);
    });
  });

  describe('computeHeights', function() {
    function mc(y, x, desiredHeight, colSpan) {
      return { x: x, y: y, desiredHeight: desiredHeight, rowSpan: colSpan };
    }

    it('finds the maximum desired height of each row', function() {
      let heights = [];
      let cells = [
        [mc(0, 0, 7), mc(0, 1, 3), mc(0, 2, 5)],
        [mc(1, 0, 8), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 6), mc(2, 1, 9), mc(2, 2, 1)],
      ];

      computeHeights(heights, cells);

      expect(heights).toEqual([7, 8, 9]);
    });

    it("won't touch hard coded values", function() {
      let heights = [null, 3];
      let cells = [
        [mc(0, 0, 7), mc(0, 1, 3), mc(0, 2, 5)],
        [mc(1, 0, 8), mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 6), mc(2, 1, 9), mc(2, 2, 1)],
      ];

      computeHeights(heights, cells);

      expect(heights).toEqual([7, 3, 9]);
    });

    it('assumes undefined desiredHeight is 1', function() {
      let heights = [];
      let cells = [[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]];
      computeHeights(heights, cells);
      expect(heights).toEqual([1]);
    });

    it('takes into account rowSpan and wont over expand', function() {
      let heights = [];
      let cells = [
        [mc(0, 0, 10, 2), mc(0, 1, 5), mc(0, 2, 2)],
        [mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)],
      ];
      computeHeights(heights, cells);
      expect(heights).toEqual([5, 5, 4]);
    });

    it('will expand rows involved in rowSpan in a balanced way', function() {
      let heights = [];
      let cells = [
        [mc(0, 0, 13, 2), mc(0, 1, 5), mc(0, 2, 5)],
        [mc(1, 1, 5), mc(1, 2, 2)],
        [mc(2, 0, 4), mc(2, 1, 2), mc(2, 2, 1)],
      ];
      computeHeights(heights, cells);
      expect(heights).toEqual([6, 6, 4]);
    });

    it('expands across 3 rows', function() {
      let heights = [];
      let cells = [[mc(0, 0, 25, 3), mc(0, 1, 5), mc(0, 2, 4)], [mc(1, 1, 5), mc(1, 2, 2)], [mc(2, 1, 2), mc(2, 2, 1)]];
      computeHeights(heights, cells);
      expect(heights).toEqual([9, 9, 5]);
    });

    it('multiple spans in same table', function() {
      let heights = [];
      let cells = [[mc(0, 0, 25, 3), mc(0, 1, 30, 3), mc(0, 2, 4)], [mc(1, 2, 2)], [mc(2, 2, 1)]];
      computeHeights(heights, cells);
      expect(heights).toEqual([11, 9, 8]);
    });
  });

  /**
   * Provides a shorthand for validating a table of cells.
   * To pass, both arrays must have the same dimensions, and each cell in `actualRows` must
   * satisfy the shorthand assertion of the corresponding location in `expectedRows`.
   *
   * Available Expectations Can Be:
   *
   *    * A `String` -  Must be a normal cell with contents equal to the String value.
   *    * `null` -  Must be a RowSpanCell
   *
   * Or an `Object` with any of the following properties (multiple properties allowed):
   *    * rowSpan:Number - Must be a normal cell with the given rowSpan.
   *    * colSpan:Number - Must be a normal cell with the given colSpan.
   *    * content:String - Must be a normal cell with the given content.
   *    * spannerFor:[row,col] - Must be a RowSpanCell delegating to the cell at the given coordinates.
   *
   * @param actualRows - the table of cells under test.
   * @param expectedRows - a table of shorthand assertions.
   */

  function checkLayout(actualTable, expectedTable) {
    expectedTable.forEach(function(expectedRow, y) {
      expectedRow.forEach(function(expectedCell, x) {
        if (expectedCell !== null) {
          let actualCell = findCell(actualTable, x, y);
          checkExpectation(actualCell, expectedCell, x, y, actualTable);
        }
      });
    });
  }

  function findCell(table, x, y) {
    for (let i = 0; i < table.length; i++) {
      let row = table[i];
      for (let j = 0; j < row.length; j++) {
        let cell = row[j];
        if (cell.x === x && cell.y === y) {
          return cell;
        }
      }
    }
  }

  function checkExpectation(actualCell, expectedCell, x, y, actualTable) {
    if (typeof expectedCell === 'string') {
      expectedCell = { content: expectedCell };
    }
    if (Object.prototype.hasOwnProperty.call(expectedCell, 'content')) {
      expect(actualCell).toBeInstanceOf(Cell);
      expect(actualCell.content).toEqual(expectedCell.content);
    }
    if (Object.prototype.hasOwnProperty.call(expectedCell, 'rowSpan')) {
      expect(actualCell).toBeInstanceOf(Cell);
      expect(actualCell.rowSpan).toEqual(expectedCell.rowSpan);
    }
    if (Object.prototype.hasOwnProperty.call(expectedCell, 'colSpan')) {
      expect(actualCell).toBeInstanceOf(Cell);
      expect(actualCell.colSpan).toEqual(expectedCell.colSpan);
    }
    if (Object.prototype.hasOwnProperty.call(expectedCell, 'spannerFor')) {
      expect(actualCell).toBeInstanceOf(Cell.RowSpanCell);
      expect(actualCell.originalCell).toBeInstanceOf(Cell);
      expect(actualCell.originalCell).toEqual(
        findCell(actualTable, expectedCell.spannerFor[1], expectedCell.spannerFor[0])
      );
      //TODO: retest here x,y coords
    }
  }
});
