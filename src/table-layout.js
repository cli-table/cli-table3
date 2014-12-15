var _ = require('lodash');
var Cell = require('./cell');


function makeTableLayout(rows){
  var cellRows = generateCells(rows);
  fillInLayout(cellRows);
  return cellRows;
}

function fillInLayout(cellRows){
  for(var rowIndex = cellRows.length-1; rowIndex >= 0; rowIndex--){
    var cellColumns = cellRows[rowIndex];
    for(var columnIndex = 0; columnIndex < cellColumns.length; columnIndex++){
      var cell = cellColumns[columnIndex];
      for(var k = 1; k < cell.colSpan; k++){
        cellColumns.splice(columnIndex+1,0,new Cell.NoOpCell());
      }
      for(var i = 1; i < cell.rowSpan; i ++){
        var insertionRow = cellRows[rowIndex + i];
        var spliceArgs = [columnIndex,0,new Cell.RowSpanCell(cell)];
        for(var j = 1; j < cell.colSpan; j++){
          spliceArgs.push(new Cell.NoOpCell());
        }
        insertionRow.splice.apply(insertionRow,spliceArgs);
      }
    }
  }
}

function generateCells(rows){
  return _.map(rows,function(row){
    return _.map(row,function(cell){
      return new Cell(cell);
    });
  });
}

module.exports = makeTableLayout;