var Table = require('../src/table');
var colors = require('colors/safe');

module.exports = function(runTest) {

  function it(name, fn) {
    var result = fn();
    runTest(name, result[0], result[1], result[2]);
  }

  it('Basic Usage', function (){
    function makeTable(){
      var table = new Table({
        head: ['Rel', 'Change', 'By', 'When']
        , style: {
          'padding-left': 1
          , 'padding-right': 1
          , head: []
          , border: []
        }
        , colWidths: [6, 21, 25, 17]
      });

      table.push(
          ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
        , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
      );

      return table;
    }

    var expected = [
        '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
      , '│ Rel  │ Change              │ By                      │ When            │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │'
      , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
    ];

    return [makeTable,expected];
  });


  it('Create vertical tables by adding objects a single key that contains an array', function() {
    function makeTable(){
      var table = new Table({ style: {'padding-left':0, 'padding-right':0, head:[], border:[]} });

      table.push(
          {'v0.1': 'Testing something cool'}
        , {'v0.1': 'Testing something cool'}
      );

      return table;
    }

    var expected = [
        '┌────┬──────────────────────┐'
      , '│v0.1│Testing something cool│'
      , '├────┼──────────────────────┤'
      , '│v0.1│Testing something cool│'
      , '└────┴──────────────────────┘'
    ];

    return [makeTable,expected];
  });

  it('Cross tables are similar to vertical tables, but include an empty string for the first header', function() {
    function makeTable(){
      var table = new Table({ head: ["", "Header 1", "Header 2"], style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

      table.push(
        {"Header 3": ['v0.1', 'Testing something cool'] }
        , {"Header 4": ['v0.1', 'Testing something cool'] }
      );

      return table;
    }

    var expected = [
        '┌────────┬────────┬──────────────────────┐'
      , '│        │Header 1│Header 2              │'
      , '├────────┼────────┼──────────────────────┤'
      , '│Header 3│v0.1    │Testing something cool│'
      , '├────────┼────────┼──────────────────────┤'
      , '│Header 4│v0.1    │Testing something cool│'
      , '└────────┴────────┴──────────────────────┘'
    ];

    return [makeTable,expected];
  });

  it('Stylize the table with custom border characters', function (){
    function makeTable(){
      var table = new Table({
        chars: {
          'top': '═'
          , 'top-mid': '╤'
          , 'top-left': '╔'
          , 'top-right': '╗'
          , 'bottom': '═'
          , 'bottom-mid': '╧'
          , 'bottom-left': '╚'
          , 'bottom-right': '╝'
          , 'left': '║'
          , 'left-mid': '╟'
          , 'right': '║'
          , 'right-mid': '╢'
        },
        style: {
          head: []
          , border: []
        }
      });

      table.push(
        ['foo', 'bar', 'baz']
        , ['frob', 'bar', 'quuz']
      );

      return table;
    }

    var expected = [
        '╔══════╤═════╤══════╗'
      , '║ foo  │ bar │ baz  ║'
      , '╟──────┼─────┼──────╢'
      , '║ frob │ bar │ quuz ║'
      , '╚══════╧═════╧══════╝'
    ];

    return [makeTable,expected];
  });

};