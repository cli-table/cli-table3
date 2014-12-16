var Table = require('../src/table');
var colors = require('colors');

module.exports = function(){

  var table = new Table({colWidths:[5,5,5],rowHeights:[7]});

  table.push(
    [{content:'hello how are you fine sir\ngreat\nand you', colSpan:3},'b','c'],
    [{hAlign:'left',content:'e'},'f',' g '.white.bgBlack],
    [{hAlign:'right',content:'h'},'i'.red,'j']
  );

  console.log(table.toString());
};