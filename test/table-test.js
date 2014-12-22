describe('@api Table ',function(){
  var chai = require('chai');
  var expect = chai.expect;
  var Table = require('..');
  var colors = require('colors/safe');

  it('wordWrap with colored text',function(){
    var table = new Table({style:{border:[],head:[]},wordWrap:true,colWidths:[7,9]});

    table.push([colors.red('Hello how are you?'),colors.blue('I am fine thanks!')]);

    var expected = [
        '┌───────┬─────────┐'
      , '│ ' + colors.red('Hello') + ' │ ' + colors.blue('I am') + '    │'
      , '│ ' + colors.red('how') + '   │ ' + colors.blue('fine') + '    │'
      , '│ ' + colors.red('are') + '   │ ' + colors.blue('thanks!') + ' │'
      , '│ ' + colors.red('you?') + '  │         │'
      , '└───────┴─────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  })
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