
var utils = require('./utils');
var tableLayout = require('./table-layout');
var _ = require('lodash');

function Table(options){
  this.options = utils.mergeOptions(options);
}

Table.prototype.__proto__ = Array.prototype;

Table.prototype.toString = function(){
  var cells = tableLayout.makeTableLayout(this);

  _.forEach(cells,function(row){
    _.forEach(row,function(cell){
      cell.mergeTableOptions(this.options);
    },this);
  },this);

  tableLayout.computeWidths(this.options.colWidths,cells);
  tableLayout.computeHeights(this.options.rowHeights,cells);

  _.forEach(cells,function(row,rowIndex){
    _.forEach(row,function(cell,cellIndex){
      cell.init(this.options,cellIndex,rowIndex);
    },this);
  },this);

  var result = [];

  for(var rowIndex = 0; rowIndex < cells.length; rowIndex++){
    var row = cells[rowIndex];
    var heightOfRow = this.options.rowHeights[rowIndex];

    result.push(doDraw(row,'top'));

    for(var lineNum = 0; lineNum < heightOfRow; lineNum++){
      result.push(doDraw(row,lineNum));
    }

    if(rowIndex + 1 == cells.length){
      result.push(doDraw(row,'bottom'));
    }
  }

  return result.join('\n');
};

function doDraw(row,lineNum){
  console.log('drawing lineNum',lineNum);
  var line = [];
  _.forEach(row,function(cell){
    line.push(cell.draw(lineNum));
  });
  return line.join('');
}

module.exports = Table;