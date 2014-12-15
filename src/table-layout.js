var _ = require('lodash');
(function(){

var Cell = require('./cell');

function makeTableLayout(rows){
  var cellRows = generateCells(rows);
  expandCells(cellRows);
  fillInTable(cellRows);
  return cellRows;
}

function expandCells(cellRows){
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

function fillInTable(rows){
  var height = rows.length;
  var width = maxWidth(rows);
  for(var rowIndex = 0; rowIndex < height; rowIndex++){
    var row = rows[rowIndex];
    for(var colIndex = 0; colIndex < width; colIndex++){
      var cell = row[colIndex];
      if(!cell){
        var i = colIndex+1;
        while(i < width && !row[i]){
          row[i] = new Cell.NoOpCell();
          i++;
        }
        var j = rowIndex + 1;
        while(j < height && allBlank(rows[j],colIndex,i)){
          for(var k = colIndex+1; k < i; k++){
            rows[j][k] = new Cell.NoOpCell();
          }
          j++;
        }
        var rowSpan = j - rowIndex;
        var blankCell = new Cell(
          {colSpan:i-colIndex,rowSpan: rowSpan}
        );
        row[colIndex] = blankCell;
        for(var n = 1; n < rowSpan; n++){
          rows[rowIndex+n][colIndex] = new Cell.RowSpanCell(blankCell);
        }
      }
    }
  }
}

function allBlank(row,from,to){
  for(var i = from; i < to; i++){
    if(row[i]) return false;
  }
  return true;
}

function generateCells(rows){
  return _.map(rows,function(row){
    return _.map(row,function(cell){
      return new Cell(cell);
    });
  });
}

function maxWidth(rows){
  return _.reduce(rows,function(maxWidth,row){
    return Math.max(maxWidth,row.length);
  },0);
}

function iterateColumn(rows,col,fn,ctx){
  for(var i = 0; i < rows.length; i++){
    fn.call(ctx,rows[i][col],i);
  }
}
  function getCell(rows,y,x){
    return rows[y][x];
  }

  function getCellPivot(rows,x,y){
    return rows[y][x];
  }

  function iterateRow(rows,row,fn,ctx){
    var columns = rows[row];
    for(var i = 0; i < columns.length; i++){
      fn.call(ctx,columns[i],i);
    }
  }
  function maxHeight(rows){
    return rows.length;
  }

module.exports = {
  makeTableLayout:makeTableLayout,
  maxWidth:maxWidth,
  fillInTable:fillInTable,
  computeWidths:makeComputeWidths(iterateColumn,maxWidth,'colSpan','desiredWidth',getCell),
  computeHeights:makeComputeWidths(iterateRow,maxHeight,'rowSpan','desiredHeight',getCellPivot)
};

})();

function makeComputeWidths(iterateColumn,maxWidth,colSpan,desiredWidth,getCell){
  return function (vals,rows){
    var width = maxWidth(rows);
    var result = [];
    var spanners = [];
    for(var columnIndex = 0; columnIndex < width; columnIndex++){
      if(!_.isNumber(vals[columnIndex])){
        var maxDesired = 0;
        iterateColumn(rows,columnIndex,function(cell,rowIndex){
          if(cell[colSpan] && cell[colSpan] > 1){
            spanners.push({row:rowIndex,column:columnIndex});
          }
          else {
            maxDesired = Math.max(maxDesired,cell[desiredWidth] || 0);
          }
        });
        result[columnIndex] = maxDesired;
      }
      else {
        result[columnIndex] = vals[columnIndex];
        iterateColumn(rows,columnIndex,function(cell,rowIndex) {
          if (cell[colSpan] && cell[colSpan] > 1) {
            spanners.push({row: rowIndex, column: columnIndex});
          }
        });
      }
    }
    while(spanners.length){
      var coords = spanners.pop();
      var cell = getCell(rows,coords.row,coords.column);
      var span = cell[colSpan];
      var existingWidth = result[coords.column];
      var editableCols = _.isNumber(vals[coords.column]) ? 0 : 1;
      for(var i = 1; i < span; i ++){
        existingWidth += 1 + result[coords.column + i];
        if(!_.isNumber(vals[coords.column + i])){
          editableCols++;
        }
      }
      if(cell[desiredWidth] > existingWidth){
        i = 0;
        while(editableCols > 0 && cell[desiredWidth] > existingWidth){
          if(!_.isNumber(vals[coords.column+i])){
            var dif = Math.round( (cell[desiredWidth] - existingWidth) / editableCols );
            existingWidth += dif;
            result[coords.column + i] += dif;
            editableCols--;
          }
          i++;
        }
      }
    }
    _.extend(vals,result);
  }
}