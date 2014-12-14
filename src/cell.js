var _ = require('lodash');
var utils = require('./utils');

function Cell(options){
  options = options || {};
  options.style = options.style || {};
  this.options = options;
  this.colSpan = options.colSpan || 1;
  this.rowSpan = options.rowSpan || 1;
}

Cell.prototype.init = function(tableOptions, x, y){
  if(this.options.chars){
    this.chars = _.extend({},tableOptions.chars,this.options.chars);
  }
  else {
    this.chars = tableOptions.chars;
  }

  this.truncate = this.options.truncate || tableOptions.truncate;

  this.width = tableOptions.colWidths[x];
  for(var i = 1; i < this.colSpan; i++){
    this.width += 1 + tableOptions.colWidths[x + i];
  }

  this.height = tableOptions.rowHeights[y];
  for(var i = 1; i < this.rowSpan; i++){
    this.height += 1 + tableOptions.rowHeights[y + i];
  }

  this.hAlign = this.options.hAlign || tableOptions.colAligns[x];

  this.paddingLeft = (this.options.style.paddingLeft || this.options.style['padding-left'] ||
  tableOptions.style.paddingLeft || tableOptions.style['padding-left']);

  this.paddingRight = (this.options.style.paddingRight || this.options.style['padding-right'] ||
  tableOptions.style.paddingRight || tableOptions.style['padding-right']);

  this.x = x;
  this.y = y;
};

Cell.prototype.drawTop = function(drawRight){
  var left = this.chars[this.y == 0 ? (this.x == 0 ? 'top-left' : 'top-mid') : (this.x == 0 ? 'left-mid' : 'mid-mid')];
  var content = utils.repeat(this.chars.top,this.width);
  var right = drawRight ? this.chars[this.y == 0 ? 'top-right' : 'right-mid'] : '';
  return left + content + right;
};

Cell.prototype.drawLine = function(lineNum,drawRight){
  if(lineNum == 0){
    return this.drawTop(drawRight);
  } else {
    var left = this.chars[this.x == 0 ? 'left' : 'middle'];
    var leftPadding = utils.repeat(' ', this.paddingLeft);
    var right = (drawRight ? this.chars['right'] : '');
    var rightPadding = utils.repeat(' ', this.paddingRight);
    var line = this.content.split('\n')[lineNum -1];
    var content = utils.pad(line, this.width - (this.paddingLeft + this.paddingRight), ' ', this.hAlign);
    return left + leftPadding + content + rightPadding + right;
  }
};

Cell.prototype.drawBottom = function(drawRight){
  var left = this.chars[this.x == 0 ? 'bottom-left' : 'bottom-mid'];
  var content = utils.repeat(this.chars.bottom,this.width);
  var right = drawRight ? this.chars['bottom-right'] : '';
  return left + content + right;
};

module.exports = Cell;