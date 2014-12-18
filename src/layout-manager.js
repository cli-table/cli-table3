var _ = require('lodash');
var Cell = require('./cell');
var RowSpanCell = Cell.RowSpanCell;

function layoutTable(table){
  _.forEach(table,function(row,rowIndex){
    var maxWidth;
    _.forEach(row,function(cell,columnIndex){
      cell.y = rowIndex;
      cell.x = columnIndex;
      for(var y = 0; y <= rowIndex; y++){
        var row2 = table[y];
        var xMax = (y === rowIndex) ? columnIndex : row2.length;
        for(var x = 0; x < xMax; x++){
          var cell2 = row2[x];
          while(conflict(cell,cell2)){
            cell.x++;
          }
          maxWidth = Math.max(maxWidth,columnIndex + cell.colSpan);
        }
      }
    });
  });
}

function conflict(cell1,cell2){
  var yMin1 = cell1.y;
  var yMax1 = cell1.y - 1 + (cell1.rowSpan || 1);
  var yMin2 = cell2.y;
  var yMax2 = cell2.y - 1 + (cell2.rowSpan || 1);
  var yConflict = !(yMin1 > yMax2 || yMin2 > yMax1);

  var xMin1= cell1.x;
  var xMax1 = cell1.x - 1 + (cell1.colSpan || 1);
  var xMin2= cell2.x;
  var xMax2 = cell2.x - 1 + (cell2.colSpan || 1);
  var xConflict = !(xMin1 > xMax2 || xMin2 > xMax1);

  return yConflict && xConflict;
}

function addRowSpanCells(table){
  _.forEach(table,function(row,rowIndex){
    _.forEach(row,function(cell){
      for(var i = 1; i < cell.rowSpan; i++){
        var rowSpanCell = new RowSpanCell(cell);
        rowSpanCell.x = cell.x;
        rowSpanCell.y = cell.y + i;
        insertCell(rowSpanCell,table[rowIndex+i]);
      }
    });
  });
}

function insertCell(cell,row){
  var x = 0;
  while(x < row.length && (row[x].x < cell.x)) {
    x++;
  }
  row.splice(x,0,cell);
}

module.exports = {
  layoutTable: layoutTable,
  addRowSpanCells: addRowSpanCells
};