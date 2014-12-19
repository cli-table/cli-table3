var Table = require('../src/table');
var colors = require('colors/safe');

module.exports = function(runTest,screenshot) {

  function it(name, fn) {
    var result = fn();
    runTest(name, result[0], result[1]);
  }

};