var _ = require('lodash');
var utils = require('./utils');

/**
 * A representation of a cell within the table.
 * Implementations must have `init` and `draw` methods,
 * as well as `colSpan`, `rowSpan`, `desiredHeight` and `desiredWidth` properties.
 * @param options
 * @constructor
 */
function Cell(options){
  this.setOptions(options);
}

function findOption(objA,objB,nameA,nameB){
  return objA[nameA] || objA[nameB] || objB[nameA] || objB[nameB];
}

function findDimension(dimensionTable, startingIndex, span){
  var ret = dimensionTable[startingIndex];
  for(var i = 1; i < span; i++){
    ret += 1 + dimensionTable[startingIndex + i];
  }
  return ret;
}

Cell.prototype.setOptions = function(options){
  this.options = options;
  this.colSpan = (options && options.colSpan) || 1;
  this.rowSpan = (options && options.rowSpan) || 1;
};

/**
 * Initializes the Cells data structure.
 * @param tableOptions - A fully populated set of tableOptions.
 * In addition to the standard default values, tableOptions must be populated with the actual
 * `colWidths` and `rowWidths`. Both arrays must have lengths equal to the number of columns
 * or rows (respectively) in this table, and all items in each array must have number value.
 *
 * @param x - The column this cell is in (with column 0 being on the left).
 *
 * @param y - The row this cell is in (with row 0 being at the top).
 */
Cell.prototype.init = function(tableOptions, x, y){
  this.options = this.options || {};
  this.options.style = this.options.style || {};
  if(this.options.chars){
    this.chars = _.extend({},tableOptions.chars,this.options.chars);
  }
  else {
    this.chars = tableOptions.chars;
  }

  this.truncate = this.options.truncate || tableOptions.truncate;

  this.width = findDimension(tableOptions.colWidths, x, this.colSpan);
  this.height = findDimension(tableOptions.rowHeights, y, this.rowSpan);

  this.hAlign = this.options.hAlign || tableOptions.colAligns[x];
  this.vAlign = this.options.vAlign || tableOptions.rowAligns[y];

  this.paddingLeft = findOption(this.options.style, tableOptions.style, 'paddingLeft', 'padding-left');
  this.paddingRight = findOption(this.options.style, tableOptions.style, 'paddingRight', 'padding-right');

  this.drawRight = x + this.colSpan == tableOptions.colWidths.length;

  this.x = x;
  this.y = y;
};

Cell.prototype.drawTop = function(drawRight){
  var left = this.chars[this.y == 0 ? (this.x == 0 ? 'top-left' : 'top-mid') : (this.x == 0 ? 'left-mid' : 'mid-mid')];
  var content = utils.repeat(this.chars.top,this.width);
  var right = drawRight ? this.chars[this.y == 0 ? 'top-right' : 'right-mid'] : '';
  return left + content + right;
};

Cell.prototype.drawLine = function(lineNum,drawRight,forceTruncationSymbol){
  var left = this.chars[this.x == 0 ? 'left' : 'middle'];
  var leftPadding = utils.repeat(' ', this.paddingLeft);
  var right = (drawRight ? this.chars['right'] : '');
  var rightPadding = utils.repeat(' ', this.paddingRight);
  var line = this.lines[lineNum];
  var len = this.width - (this.paddingLeft + this.paddingRight);
  if(forceTruncationSymbol) line += this.truncate || '…';
  var content = utils.truncate(line,len,this.truncate);
  content = utils.pad(content, len, ' ', this.hAlign);
  return left + leftPadding + content + rightPadding + right;
};

Cell.prototype.drawEmpty = function(drawRight){
  var left = this.chars[this.x == 0 ? 'left' : 'middle'];
  var right = (drawRight ? this.chars['right'] : '');
  var content = utils.repeat(' ',this.width);
  return left + content + right;
};

/**
 * Draws the given line of the cell.
 * @param lineNum - can be `top`, `bottom` or a numerical line number.
 * @returns {String} The representation of this line.
 */
Cell.prototype.draw = function(lineNum){
  if(lineNum == 'top') return this.drawTop(this.drawRight);
  if(lineNum == 'bottom') return this.drawBottom(this.drawRight);
  var padLen = Math.max(this.height - this.lines.length, 0);
  var padTop;
  switch (this.vAlign){
    case 'top':
      padTop = 0;
      break;
    case 'bottom':
      padTop = padLen;
      break;
    default :
      padTop = Math.ceil(padLen / 2);
  }
  if( (lineNum < padTop) || (lineNum >= (padTop + this.lines.length))){
    return this.drawEmpty(this.drawRight);
  }
  var forceTruncation = (this.lines.length > this.height) && (lineNum + 1 >= this.height);
  return this.drawLine(lineNum - padTop, this.drawRight, forceTruncation);
};

Cell.prototype.drawBottom = function(drawRight){
  var left = this.chars[this.x == 0 ? 'bottom-left' : 'bottom-mid'];
  var content = utils.repeat(this.chars.bottom,this.width);
  var right = drawRight ? this.chars['bottom-right'] : '';
  return left + content + right;
};


/**
 * A Cell that doesn't do anything. It just draws empty lines.
 * Used as a placeholder in column spanning.
 * @constructor
 */
function NoOpCell(){}

NoOpCell.prototype.draw = function(){
  return '';
};

NoOpCell.prototype.init = function(){};

/**
 * A placeholder Cell for a Cell that spans multiple rows.
 * It delegates rendering to the original cell, but adds the appropriate offset.
 * @param originalCell
 * @constructor
 */
function RowSpanCell(originalCell){
  this.originalCell = originalCell;
}

RowSpanCell.prototype.init = function(tableOptions,x,y){
  var originalY = this.originalCell.y;
  this.offset = findDimension(tableOptions.rowHeights,originalY,y-originalY);
};

RowSpanCell.prototype.draw = function(lineNum){
  if(lineNum == 'top'){
    return this.originalCell.draw(this.offset);
  }
  if(lineNum == 'bottom'){
    return this.originalCell.draw('bottom');
  }
  return this.originalCell.draw(this.offset + 1 + lineNum);
};

module.exports = Cell;
module.exports.NoOp = NoOpCell;
module.exports.RowSpan = RowSpanCell;