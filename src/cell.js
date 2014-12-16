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

Cell.prototype.setOptions = function(options){
  if(_.isString(options) || _.isNumber(options)){
    options = {content:''+options};
  }
  options = options || {};
  this.options = options;
  this.content = options.content || '';
  this.lines = this.content.split('\n');
  this.colSpan = options.colSpan || 1;
  this.rowSpan = options.rowSpan || 1;
};

Cell.prototype.mergeTableOptions = function(tableOptions){
  this.options.style = this.options.style || {};

  if(this.options.chars){
    this.chars = _.extend({},tableOptions.chars,this.options.chars);
  }
  else {
    this.chars = tableOptions.chars;
  }

  this.truncate = this.options.truncate || tableOptions.truncate;

  this.paddingLeft = findOption(this.options.style, tableOptions.style, 'paddingLeft', 'padding-left');
  this.paddingRight = findOption(this.options.style, tableOptions.style, 'paddingRight', 'padding-right');

  this.desiredWidth = utils.strlen(this.content) + this.paddingLeft + this.paddingRight;
  this.desiredHeight = this.lines.length;
};

/**
 * Initializes the Cells data structure.
 *
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
  this.width = findDimension(tableOptions.colWidths, x, this.colSpan);
  this.height = findDimension(tableOptions.rowHeights, y, this.rowSpan);

  this.hAlign = this.options.hAlign || tableOptions.colAligns[x];
  this.vAlign = this.options.vAlign || tableOptions.rowAligns[y];

  this.drawRight = x + this.colSpan == tableOptions.colWidths.length;

  this.x = x;
  this.y = y;
};

/**
 * Draws the given line of the cell.
 * This default implementation differs to methods `drawTop`, `drawBottom`, `drawLine` and `drawEmpty`.
 * @param lineNum - can be `top`, `bottom` or a numerical line number.
 * @returns {String} The representation of this line.
 */
Cell.prototype.draw = function(lineNum){
  if(lineNum == 'top') return this.drawTop(this.drawRight);
  if(lineNum == 'bottom') return this.drawBottom(this.drawRight);
  var padLen = Math.max(this.height - this.lines.length, 0);
  var padTop;
  switch (this.vAlign){
    case 'center':
      padTop = Math.ceil(padLen / 2);
      break;
    case 'bottom':
      padTop = padLen;
      break;
    default :
      padTop = 0;
  }
  if( (lineNum < padTop) || (lineNum >= (padTop + this.lines.length))){
    return this.drawEmpty(this.drawRight);
  }
  var forceTruncation = (this.lines.length > this.height) && (lineNum + 1 >= this.height);
  return this.drawLine(lineNum - padTop, this.drawRight, forceTruncation);
};

/**
 * Renders the top line of the cell.
 * @param drawRight - true if this method should render the right edge of the cell.
 * @returns {String}
 */
Cell.prototype.drawTop = function(drawRight){
  var left = this.chars[this.y == 0 ? (this.x == 0 ? 'top-left' : 'top-mid') : (this.x == 0 ? 'left-mid' : 'mid-mid')];
  var content = utils.repeat(this.chars[this.y == 0 ? 'top' : 'mid'],this.width);
  var right = drawRight ? this.chars[this.y == 0 ? 'top-right' : 'right-mid'] : '';
  return this.wrapWithStyleColors('border',left + content + right);
};

Cell.prototype.wrapWithStyleColors = function(styleProperty,content){
  var style = this.options.style;
  if(style && style[styleProperty] && style[styleProperty].length){
    var colors = require('colors/safe');
    for(var i = 0; i < style[styleProperty].length; i++){
      colors = colors[style[styleProperty][i]];
    }
    return colors(content);
  }
  else {
    return content;
  }
};

/**
 * Renders a line of text.
 * @param lineNum - Which line of text to render. This is not necessarily the line within the cell.
 * There may be top-padding above the first line of text.
 * @param drawRight - true if this method should render the right edge of the cell.
 * @param forceTruncationSymbol - `true` if the rendered text should end with the truncation symbol even
 * if the text fits. This is used when the cell is vertically truncated. If `false` the text should
 * only include the truncation symbol if the text will not fit horizontally within the cell width.
 * @returns {String}
 */
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
  content = leftPadding + content + rightPadding;
  left = this.wrapWithStyleColors('border',left);
  right = this.wrapWithStyleColors('border',right);
  if(this.y === 0){
    content = this.wrapWithStyleColors('head',content);
  }
  return left + content + right;
};

/**
 * Renders the bottom line of the cell.
 * @param drawRight - true if this method should render the right edge of the cell
 * @returns {String}
 */
Cell.prototype.drawBottom = function(drawRight){
  var left = this.chars[this.x == 0 ? 'bottom-left' : 'bottom-mid'];
  var content = utils.repeat(this.chars.bottom,this.width);
  var right = drawRight ? this.chars['bottom-right'] : '';
  return this.wrapWithStyleColors('border',left + content + right);
};

/**
 * Renders a blank line of text within the cell. Used for top and/or bottom padding.
 * @param drawRight - true if this method should render the right edge of the cell
 * @returns {String}
 */
Cell.prototype.drawEmpty = function(drawRight){
  var left = this.chars[this.x == 0 ? 'left' : 'middle'];
  var right = (drawRight ? this.chars['right'] : '');
  var content = utils.repeat(' ',this.width);
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

NoOpCell.prototype.init =
NoOpCell.prototype.mergeTableOptions =
RowSpanCell.prototype.mergeTableOptions = function(){};

// HELPER FUNCTIONS
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

module.exports = Cell;
module.exports.NoOpCell = NoOpCell;
module.exports.RowSpanCell = RowSpanCell;