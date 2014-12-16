describe('Table', function () {
  var Table = require('../src/table');
  var chai = require('chai');
  var expect = chai.expect;

  it('empty table has a width of 0',function(){
    var table = new Table();
    expect(table.width).to.equal(0);
    expect(table.toString()).to.equal('');
  });

});