describe('Table', function () {
  var Table = require('../src/table');
  var chai = require('chai');
  var expect = chai.expect;
  var colors = require('colors/safe');

  it('colSpan spans columns',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{colSpan:2,content:'greetings'}],
      [{colSpan:2,content:'greetings'}],
      ['hello','howdy']
    );

    var expected = [
        '┌───────────────┐'
      , '│ greetings     │'
      , '├───────────────┤'
      , '│ greetings     │'
      , '├───────┼───────┤'
      , '│ hello │ howdy │'
      , '└───────┴───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('colSpan below',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      ['hello','howdy'],
      [{colSpan:2,content:'greetings'}],
      [{colSpan:2,content:'greetings'}]
    );

    var expected = [
        '┌───────┬───────┐'
      , '│ hello │ howdy │'
      , '├───────────────┤'
      , '│ greetings     │'
      , '├───────────────┤'
      , '│ greetings     │'
      , '└───────────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan spans rows',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings'},'hello'],
      ['howdy']
    );

    var expected = [
        '┌───────────┬───────────┬───────┐'
      , '│ greetings │ greetings │ hello │'
      , '│           │           ┼───────┤'
      , '│           │           │ howdy │'
      , '└───────────┴───────────┴───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan to the right',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      ['hello',{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings'}],
      ['howdy']
    );

    var expected = [
        '┌───────┬───────────┬───────────┐'
      , '│ hello │ greetings │ greetings │'
      , '├───────│           │           │'
      , '│ howdy │           │           │'
      , '└───────┴───────────┴───────────┘'
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