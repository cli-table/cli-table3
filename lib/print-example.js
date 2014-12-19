var utils = require('../src/utils');
var chai = require('chai');
var expect = chai.expect;
var colors = require('colors/safe');

function runExample(fn,callback){
  function printExample(name,fn,expected){
    callback(colors.gray('=========  ') + name + colors.gray('  ================'));
    callback(fn().toString());
    var message = fn.toString().split('\n').slice(1,-2).join('\n');
    callback(message);
    callback('\n');
  }

  fn(printExample);
}

function testExample(name,fn,expected){
  it(name,function(){
    expect(fn().toString()).to.equal(expected.join('\n'));
  });
}

function runTest(fn){
  describe('@api Table', function () {
    fn(testExample);
  });
}

module.exports = {
  printExample:runExample,
  runTest:runTest
};