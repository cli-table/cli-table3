var Table = require('../src/table');

module.exports = function(){

  var table = new Table();

  table.push(
    [{content:'hello how are you', colSpan:3},'b','c'],
    ['e','f','g'],
    ['h','i','j']
  );

  console.log(table.toString());
};