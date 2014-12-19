var printExamples = require('../lib/print-example');
var examples = require('../examples/examples');

printExamples.runTest(examples);
/* describe('@api Table', function () {
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
      [{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings',vAlign:'center'},'hello'],
      ['howdy']
    );

    var expected = [
        '┌───────────┬───────────┬───────┐'
      , '│ greetings │           │ hello │'
      , '│           │ greetings ├───────┤'
      , '│           │           │ howdy │'
      , '└───────────┴───────────┴───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('rowSpan to the right',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      ['hello',{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings',vAlign:'bottom'}],
      ['howdy']
    );

    var expected = [
        '┌───────┬───────────┬───────────┐'
      , '│ hello │ greetings │           │'
      , '├───────┤           │           │'
      , '│ howdy │           │ greetings │'
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

  it('stairstep spans',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{content:'',rowSpan:2},''],
      [{content:'',rowSpan:2}],
      ['']
    );

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

  it('stairstep spans - empty cells autofilled',function(){
    var table = new Table({style:{head:[],border:[]}});

    table.push(
      [{content:'',rowSpan:3,colSpan:2},'hi'],
      [],
      [{content:'',rowSpan:2,colSpan:2}],
      []
    );

    var expected = [
        '┌───┬────┬──┐'
      , '│   │ hi │  │'  // top-right and bottom-left cells are automatically created to fill the empty space
      , '│   ├────┤  │'
      , '│   │    │  │'
      , '│   ├────┴──┤'
      , '│   │       │'
      , '├───┤       │'
      , '│   │       │'
      , '└───┴───────┘'
    ];

    console.log(table.toString());
    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('truncation symbol shows if there are undisplayed lines',function(){
    var table = new Table({rowHeights:[1],style:{head:[],border:[]}});

    table.push(['hi\nhello']);


    var expected = [
        '┌───────┐'
      , '│ hi…   │'
      , '└───────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('colSpan width expansion',function(){
    var table = new Table({style:{head:[],border:[]}});
    table.push(
      [{colSpan:2,content:'hello there'}],
      ['hi', 'hi']
    );

    var expected = [
        '┌─────────────┐'
      , '│ hello there │'
      , '├──────┬──────┤'
      , '│ hi   │ hi   │'
      , '└──────┴──────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('colSpan width expansion - specified widths',function(){
    var table = new Table({colWidths:[4],style:{head:[],border:[]}});
    table.push(
      [{colSpan:2,content:'hello there'}],
      ['hi',{hAlign:'center',content:'hi'}]
    );

    var expected = [
        '┌─────────────┐'
      , '│ hello there │'
      , '├────┬────────┤'
      , '│ hi │   hi   │'
      , '└────┴────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('colSpan width expansion - null widths',function(){
    var table = new Table({colWidths:[null, 4],style:{head:[],border:[]}});
    table.push(
      [{colSpan:2,content:'hello there'}],
      [{hAlign:'right',content:'hi'}, 'hi']
    );

    var expected = [
        '┌─────────────┐'
      , '│ hello there │'
      , '├────────┬────┤'
      , '│     hi │ hi │'
      , '└────────┴────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('colorful truncation',function(){
    var table = new Table({colWidths:[5],style:{head:[],border:[]}});

    table.push([colors.red('hello')]);
    var expected = [
        '┌─────┐'
      , '│ ' + colors.red('he') + '… │'
      , '└─────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'))
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