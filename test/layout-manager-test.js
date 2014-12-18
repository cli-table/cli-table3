describe('layout-manager',function(){
  var chai = require('chai');
  var expect = chai.expect;

  var layoutTable = require('../src/layout-manager').layoutTable;
  var addRowSpanCells = require('../src/layout-manager').addRowSpanCells;
  var Cell = require('../src/cell');
  var RowSpanCell = Cell.RowSpanCell;

  describe('layoutTable',function(){
    it('sets x and y',function(){
      var table = [
        [{},{}],
        [{},{}]
      ];

      layoutTable(table);

      expect(table).to.eql([
        [{x:0,y:0},{x:1,y:0}],
        [{x:0,y:1},{x:1,y:1}]
      ]);
    });

    it('colSpan will push x values to the right',function(){
      var table = [
        [{colSpan:2},{}],
        [{},{colSpan:2}]
      ];

      layoutTable(table);

      expect(table).to.eql([
        [{x:0,y:0,colSpan:2},{x:2,y:0}],
        [{x:0,y:1},{x:1,y:1,colSpan:2}]
      ]);
    });

    it('rowSpan will push x values on cells below',function(){
      var table = [
        [{rowSpan:2},{}],
        [{}]
      ];

      layoutTable(table);

      expect(table).to.eql([
        [{x:0,y:0,rowSpan:2},{x:1,y:0}],
        [{x:1,y:1}]
      ]);
    });

    it('colSpan and rowSpan together',function(){
      var table = [
        [{rowSpan:2,colSpan:2},{}],
        [{}]
      ];

      layoutTable(table);

      expect(table).to.eql([
        [{x:0,y:0,rowSpan:2,colSpan:2},{x:2,y:0}],
        [{x:2,y:1}]
      ]);
    });
  });

  describe('addRowSpanCells',function(){
    it('will insert a rowSpan cell - beginning of line',function(){
      var table = [
        [{x:0,y:0,rowSpan:2},{x:1,y:0}],
        [{x:1,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).to.eql([{x:0,y:0,rowSpan:2},{x:1,y:0}]);
      expect(table[1].length).to.equal(2);
      expect(table[1][0]).to.be.instanceOf(RowSpanCell);
      expect(table[1][1]).to.eql({x:1,y:1});
    });

    it('will insert a rowSpan cell - end of line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2}],
        [{x:0,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).to.eql([{x:0,y:0},{rowSpan:2,x:1,y:0}]);
      expect(table[1].length).to.equal(2);
      expect(table[1][0]).to.eql({x:0,y:1});
      expect(table[1][1]).to.be.instanceOf(RowSpanCell);
    });

    it('will insert a rowSpan cell - middle of line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2},{x:2,y:0}],
        [{x:0,y:1},{x:2,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).to.eql([{x:0,y:0},{rowSpan:2,x:1,y:0},{x:2,y:0}]);
      expect(table[1].length).to.equal(3);
      expect(table[1][0]).to.eql({x:0,y:1});
      expect(table[1][1]).to.be.instanceOf(RowSpanCell);
      expect(table[1][2]).to.eql({x:2,y:1});
    });

    it('will insert a rowSpan cell - multiple on the same line',function(){
      var table = [
        [{x:0,y:0},{x:1,y:0,rowSpan:2},{x:2,y:0,rowSpan:2},{x:3,y:0}],
        [{x:0,y:1},{x:3,y:1}]
      ];

      addRowSpanCells(table);

      expect(table[0]).to.eql([{x:0,y:0},{rowSpan:2,x:1,y:0},{rowSpan:2,x:2,y:0},{x:3,y:0}]);
      expect(table[1].length).to.equal(4);
      expect(table[1][0]).to.eql({x:0,y:1});
      expect(table[1][1]).to.be.instanceOf(RowSpanCell);
      expect(table[1][2]).to.be.instanceOf(RowSpanCell);
      expect(table[1][3]).to.eql({x:3,y:1});
    });
  });
});