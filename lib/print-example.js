var utils = require('../src/utils');
var chai = require('chai');
var expect = chai.expect;


function printExample(name,fn,expected){
  console.log('=========' + name + '================');
  console.log(fn().toString());
  var message = fn.toString().split('\n').slice(1,-2).join('\n');
  console.log(message);
  console.log('\n');
}

function runExample(fn){
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