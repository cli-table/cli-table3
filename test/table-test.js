describe('Table', function () {
  var Table = require('../src/table');
  var chai = require('chai');
  var expect = chai.expect;
  var colors = require('colors/safe');

  it('colSpan spans columns',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{colSpan:2,content:'greetings'}],
      ['hello','howdy']
    );

    var expected = [
        '┌───────────────┐'
      , '│ greetings     │'
      , '├───────┼───────┤'
      , '│ hello │ howdy │'
      , '└───────┴───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan spans rows',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{rowSpan:2,content:'greetings'},'hello'],
      ['howdy']
    );

    var expected = [
        '┌───────────┬───────┐'
      , '│ greetings │ hello │'
      , '│           ┼──────┤'
      , '│           │ howdy │'
      , '└───────────┴───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

});

/*

 var expected = [
   '┌──┬───┬──┬──┐'
 , '│  │   │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '└──┴───┴──┴──┘'
 ];
 */