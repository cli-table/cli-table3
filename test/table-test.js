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
      , '├───────┬───────┤'
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
      , '├───────┴───────┤'
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
      , '│           │           ├───────┤'
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
      , '├───────┤           │           │'
      , '│ howdy │           │           │'
      , '└───────┴───────────┴───────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan to the right of a colspan',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{content:'hello',colSpan:2},{rowSpan:2, colSpan:2,content:'sup'},{rowSpan:3,content:'hi'}],
      [{content:'howdy',colSpan:2}],
      ['o','k','','']
    );

    var expected = [
        '┌───────┬─────┬────┐'
      , '│ hello │ sup │ hi │'
      , '├───────┤     │    │'
      , '│ howdy │     │    │'
      , '├───┬───┼──┬──┤    │'
      , '│ o │ k │  │  │    │'
      , '└───┴───┴──┴──┴────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan to the right of a non-empty line',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{content:'hello',colSpan:2},{rowSpan:2, colSpan:2,content:'sup\nsup'},{rowSpan:3,content:'hi\nhi'}],
      [{content:'howdy',colSpan:2}],
      ['o','k','','']
    );

    var expected = [
        '┌───────┬─────┬────┐'
      , '│ hello │ sup │ hi │'
      , '├───────┤ sup │ hi │'
      , '│ howdy │     │    │'
      , '├───┬───┼──┬──┤    │'
      , '│ o │ k │  │  │    │'
      , '└───┴───┴──┴──┴────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan to the right - multiline content',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      ['hello',{rowSpan:2,content:'greetings\nfriends'},{rowSpan:2,content:'greetings\nfriends'}],
      ['howdy']
    );

    var expected = [
        '┌───────┬───────────┬───────────┐'
      , '│ hello │ greetings │ greetings │'
      , '├───────┤ friends   │ friends   │'
      , '│ howdy │           │           │'
      , '└───────┴───────────┴───────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  xit('stairstep spans',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{content:'',rowSpan:2},''],
      [{content:'',rowSpan:2}],
      ['']
    );

    console.log(table.toString());

    var expected = [
        '┌──┬──┐'
      , '│  │  │'
      , '│  ├──┤'
      , '│  │  │'
      , '├──┤  │'
      , '│  │  │'
      , '└──┴──┘'
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