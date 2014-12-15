var _ = require('lodash');

function strlen(str){
  var code = /\u001b\[(?:\d*;){0,5}\d*m/g;
  var stripped = ("" + str).replace(code,'');
  var split = stripped.split("\n");
  return split.reduce(function (memo, s) { return (s.length > memo) ? s.length : memo }, 0);
}

function repeat(str,times){
  return Array(times + 1).join(str);
}

function pad(str, len, pad, dir) {
  var length = strlen(str);
  if (len + 1 >= length) {
    var padlen = len - length;
    switch (dir) {
      case 'right':
        str = repeat(pad, padlen) + str;
        break;

      case 'left':
        str = str + repeat(pad,padlen);
        break;

      default:
        var right = Math.ceil((padlen) / 2);
        var left = padlen - right;
        str = repeat(pad, left) + str + repeat(pad, right);
    }
  }
  return str;
}

var codeCache = {};

function addToCodeCache(name,on,off){
  on = '\u001b[' + on + 'm';
  off = '\u001b[' + off + 'm';
  codeCache[on] = {set:name,to:true};
  codeCache[off] = {set:name,to:false};
  codeCache[name] = {on:on,off:off};
}

addToCodeCache('bold', 1, 22);
addToCodeCache('italics', 3, 23);
addToCodeCache('underline', 4, 24);
addToCodeCache('inverse', 7, 27);
addToCodeCache('strikethrough', 9, 29);


function updateState(state,controlChars){
  if(controlChars.length == 5){
    if(controlChars.charAt(2) == '3') {
      state.lastForegroundAdded = controlChars;
      return;
    }
    else if(controlChars.charAt(2) == '4') {
      state.lastBackgroundAdded = controlChars;
      return;
    }
  }
  var info = codeCache[controlChars];
  state[info.set] = info.to;
}

function unwindState(state,ret){
  var lastBackgroundAdded = state.lastBackgroundAdded;
  var lastForegroundAdded = state.lastForegroundAdded;

  delete state.lastBackgroundAdded;
  delete state.lastForegroundAdded;

  _.forEach(state,function(value,key){
    if(value){
      ret += codeCache[key].off;
    }
  });

  if(lastBackgroundAdded && (lastBackgroundAdded != '\u001b[49m')){
    ret += '\u001b[49m';
  }
  if(lastForegroundAdded && (lastForegroundAdded != '\u001b[39m')){
    ret += '\u001b[39m';
  }

  return ret;
}

function truncate(str, desiredLength, truncateChar){
  truncateChar = truncateChar || '…';
  var lengthOfStr = strlen(str);
  if(lengthOfStr <= desiredLength){
    return str;
  }
  desiredLength -= truncateChar.length;
  if(lengthOfStr === str.length){
    return str.substr(0, desiredLength) + truncateChar;
  }
  var code = /\u001b\[(?:\d*;){0,5}\d*m/g;
  var split = str.split(/\u001b\[(?:\d*;){0,5}\d*m/g);
  var splitIndex = 0;
  var retLen = 0;
  var ret = '';
  var myArray;
  var state = {};

  while(retLen < desiredLength){
    myArray = code.exec(str);
    var toAdd = split[splitIndex];
    splitIndex++;
    if (retLen + toAdd.length > desiredLength){
      toAdd = toAdd.substr(0, desiredLength - retLen);
    }
    ret += toAdd;
    retLen += toAdd.length;
    if(retLen < desiredLength){
      var controlChars = myArray[0];
      ret += controlChars;
      updateState(state,controlChars);
    }
  }

  ret = unwindState(state,ret);

  return ret + truncateChar;
}


var defaultOptions = {
  chars: {
    'top': '─'
    , 'top-mid': '┬'
    , 'top-left': '┌'
    , 'top-right': '┐'
    , 'bottom': '─'
    , 'bottom-mid': '┴'
    , 'bottom-left': '└'
    , 'bottom-right': '┘'
    , 'left': '│'
    , 'left-mid': '├'
    , 'mid': '─'
    , 'mid-mid': '┼'
    , 'right': '│'
    , 'right-mid': '┤'
    , 'middle': '│'
  }
  , truncate: '…'
  , colWidths: []
  , rowHeights: []
  , colAligns: []
  , rowAligns: []
  , style: {
    'padding-left': 1
    , 'padding-right': 1
    , head: ['red']
    , border: ['grey']
    , compact : false
  }
  , head: []
};

function mergeOptions(options,defaults){
  options = options || {};
  defaults = defaults || defaultOptions;
  var ret = _.extend({}, defaults, options);
  ret.chars = _.extend({}, defaults.chars, options.chars);
  ret.style = _.extend({}, defaults.style, options.style);
  return ret;
}

module.exports = {
  strlen:strlen,
  repeat:repeat,
  pad:pad,
  truncate:truncate,
  mergeOptions:mergeOptions
};