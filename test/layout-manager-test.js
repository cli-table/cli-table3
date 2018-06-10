describe('layout-manager',function(){
  var layoutManager = require('../src/layout-manager');
  var layoutTable = layoutManager.layoutTable;
  var addRowSpanCells = layoutManager.addRowSpanCells;
  var maxWidth = layoutManager.maxWidth;
  var Cell = require('../src/cell');
  var RowSpanCell = Cell.RowSpanCell;

  describe('layoutTable',function(){
    it('sets x and y',function(){
      var table = [
        [{},{}],
        [{},{}]
      ];

      layoutTable(table);

      expect(table).toEqual([
        [{x:0,y:0},{x:1,y:0}],
        [{x:0,y:1},{x:1,y:1}]
      ]);

      var w = maxWidth(table);
      expect(w).toEqual(2);
    });

    it('colSpan will push x values to the right',function(){
      var table = [
        [{colSpan:2},{}],
        [{},{colSpan:2}]
      ];

      layoutTable(table);

      expect(table).toEqual([
        [{x:0,y:0,colSpan:2},{x:2,y:0}],
        [{x:0,y:1},{x:1,y:1,colSpan:2}]
      ]);

      expect(maxWidth(table)).toEqual(3);
    });

    it('rowSpan will push x values on cells below',function(){
      var table = [
        [{rowSpan:2},{}],
        [{}]
      ];

      layoutTable(table);

      expect(table).toEqual([
        [{x:0,y:0,rowSpan:2},{x:1,y:0}],
        [{x:1,y:1}]
      ]);

      expect(maxWidth(table)).toEqual(2);
    });

    it('colSpan and rowSpan together',function(){
      var table = [
        [{rowSpan:2,colSpan:2},{}],
        [{}]
      ];

      layoutTable(table);

      expect(table).toEqual([
        [{x:0,y:0,rowSpan:2,colSpan:2},{x:2,y:0}],
        [{x:2,y:1}]
      ]);

      expect(maxWidth(table)).toEqual(3);
    });

    it('complex layout',function(){

      var table = [
        [{c:'a'},{c:'b'},             {c:'c',rowSpan:3,colSpan:2}, {c:'d'}],
        [{c:'e',rowSpan:2,colSpan:2},                              {c:'f'}],
        [                                                          {c:'g'}]
      ];

      layoutTable(table);

      expect(table).toEqual([
        [{c:'a',y:0,x:0},    {c:'b',y:0,x:1}, {c:'c',y:0,x:2,rowSpan:3,colSpan:2}, {c:'d',y:0,x:4}],
        [{c:'e',rowSpan:2,colSpan:2,y:1,x:0},                                       {c:'f',y:1,x:4}],
        [{c:'g',y:2,x:4}]
      ]);

    });

    it('maxWidth of single element',function(){
      var table = [[{}]];
      layoutTable(table)
      expect(maxWidth(table)).toEqual(1);
    });
  });

  describe('addRowSpanCells',function(){
    it('will insert a rowSpan cell - beginning of line',function(){
      var table = [
        [{x:0,y:0,rowSpan:2},{x:1,y:0}],
        [{x:1,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).toEqual([{x:0,y:0,rowSpan:2},{x:1,y:0}]);
      expect(table[1].length).toEqual(2);
      expect(table[1][0]).toBeInstanceOf(RowSpanCell);
      expect(table[1][1]).toEqual({x:1,y:1});
    });

    it('will insert a rowSpan cell - end of line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2}],
        [{x:0,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).toEqual([{x:0,y:0},{rowSpan:2,x:1,y:0}]);
      expect(table[1].length).toEqual(2);
      expect(table[1][0]).toEqual({x:0,y:1});
      expect(table[1][1]).toBeInstanceOf(RowSpanCell);
    });

    it('will insert a rowSpan cell - middle of line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2},{x:2,y:0}],
        [{x:0,y:1},{x:2,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).toEqual([{x:0,y:0},{rowSpan:2,x:1,y:0},{x:2,y:0}]);
      expect(table[1].length).toEqual(3);
      expect(table[1][0]).toEqual({x:0,y:1});
      expect(table[1][1]).toBeInstanceOf(RowSpanCell);
      expect(table[1][2]).toEqual({x:2,y:1});
    });

    it('will insert a rowSpan cell - multiple on the same line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2},{x:2,y:0,rowSpan:2},{x:3,y:0}],
        [{x:0,y:1},{x:3,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).toEqual([{x:0,y:0},{rowSpan:2,x:1,y:0},{rowSpan:2,x:2,y:0},{x:3,y:0}]);
      expect(table[1].length).toEqual(4);
      expect(table[1][0]).toEqual({x:0,y:1});
      expect(table[1][1]).toBeInstanceOf(RowSpanCell);
      expect(table[1][2]).toBeInstanceOf(RowSpanCell);
      expect(table[1][3]).toEqual({x:3,y:1});
    });
  });
});