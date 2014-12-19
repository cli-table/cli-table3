  var Table = require('../src/table');
  var colors = require('colors/safe');

  module.exports = function(runTest) {

    function it(name,fn) {
      var result = fn();
      runTest(name,result[0],result[1]);
    }

    it('colSpan spans columns',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{colSpan:2,content:'greetings'}],
          [{colSpan:2,content:'greetings'}],
          ['hello','howdy']
        );

        return table;
      }

      var expected = [
          '┌───────────────┐'
        , '│ greetings     │'
        , '├───────────────┤'
        , '│ greetings     │'
        , '├───────┬───────┤'
        , '│ hello │ howdy │'
        , '└───────┴───────┘'
      ];

      return [makeTable,expected];
    });

    it('colSpan below',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          ['hello','howdy'],
          [{colSpan:2,content:'greetings'}],
          [{colSpan:2,content:'greetings'}]
        );

        return table;
      }

      var expected = [
          '┌───────┬───────┐'
        , '│ hello │ howdy │'
        , '├───────┴───────┤'
        , '│ greetings     │'
        , '├───────────────┤'
        , '│ greetings     │'
        , '└───────────────┘'
      ];

      return [makeTable,expected];
    });

    it('rowSpan spans rows',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings',vAlign:'center'},'hello'],
          ['howdy']
        );

        return table;
      }

      var expected = [
          '┌───────────┬───────────┬───────┐'
        , '│ greetings │           │ hello │'
        , '│           │ greetings ├───────┤'
        , '│           │           │ howdy │'
        , '└───────────┴───────────┴───────┘'
      ];

      return [makeTable,expected];
    });


    it('rowSpan to the right',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          ['hello',{rowSpan:2,content:'greetings'},{rowSpan:2,content:'greetings',vAlign:'bottom'}],
          ['howdy']
        );

        return table;
      }

      var expected = [
          '┌───────┬───────────┬───────────┐'
        , '│ hello │ greetings │           │'
        , '├───────┤           │           │'
        , '│ howdy │           │ greetings │'
        , '└───────┴───────────┴───────────┘'
      ];

      return[makeTable,expected];
    });

    it('rowSpan to the right of a colspan',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{content:'hello',colSpan:2},{rowSpan:2, colSpan:2,content:'sup'},{rowSpan:3,content:'hi'}],
          [{content:'howdy',colSpan:2}],
          ['o','k','','']
        );

        return table;
      }

      var expected = [
          '┌───────┬─────┬────┐'
        , '│ hello │ sup │ hi │'
        , '├───────┤     │    │'
        , '│ howdy │     │    │'
        , '├───┬───┼──┬──┤    │'
        , '│ o │ k │  │  │    │'
        , '└───┴───┴──┴──┴────┘'
      ];

      return [makeTable,expected];
    });

    it('rowSpan to the right of a non-empty line',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{content:'hello',colSpan:2},{rowSpan:2, colSpan:2,content:'sup\nsup'},{rowSpan:3,content:'hi\nhi'}],
          [{content:'howdy',colSpan:2}],
          ['o','k','','']
        );

        return table;
      }

      var expected = [
          '┌───────┬─────┬────┐'
        , '│ hello │ sup │ hi │'
        , '├───────┤ sup │ hi │'
        , '│ howdy │     │    │'
        , '├───┬───┼──┬──┤    │'
        , '│ o │ k │  │  │    │'
        , '└───┴───┴──┴──┴────┘'
      ];

      return [makeTable,expected];
    });

    it('rowSpan to the right - multiline content',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          ['hello',{rowSpan:2,content:'greetings\nfriends'},{rowSpan:2,content:'greetings\nfriends'}],
          ['howdy']
        );

        return table;
      }

      var expected = [
          '┌───────┬───────────┬───────────┐'
        , '│ hello │ greetings │ greetings │'
        , '├───────┤ friends   │ friends   │'
        , '│ howdy │           │           │'
        , '└───────┴───────────┴───────────┘'
      ];

      return [makeTable, expected];
    });

    it('stairstep spans',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{content:'',rowSpan:2},''],
          [{content:'',rowSpan:2}],
          ['']
        );

        return table;
      }

      var expected = [
          '┌──┬──┐'
        , '│  │  │'
        , '│  ├──┤'
        , '│  │  │'
        , '├──┤  │'
        , '│  │  │'
        , '└──┴──┘'
      ];

      return [makeTable,expected];
    });

    it('stairstep spans - empty cells autofilled',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{content:'',rowSpan:3,colSpan:2},'hi'],
          [],
          [{content:'',rowSpan:2,colSpan:2}],
          []
        );
        return table;
      }

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

      return [makeTable,expected];
    });


    it('truncation symbol shows if there are undisplayed lines',function(){
      function makeTable(){
        var table = new Table({rowHeights:[1],style:{head:[],border:[]}});

        table.push(['hi\nhello']);

        return table;
      }

      var expected = [
         '┌───────┐'
        , '│ hi…   │'
        , '└───────┘'
      ];

      return [makeTable,expected];
    });

    it('colSpan width expansion',function(){
      function makeTable(){
        var table = new Table({style:{head:[],border:[]}});

        table.push(
          [{colSpan:2,content:'hello there'}],
          ['hi', 'hi']
        );

        return table;
      }

      var expected = [
          '┌─────────────┐'
        , '│ hello there │'
        , '├──────┬──────┤'
        , '│ hi   │ hi   │'
        , '└──────┴──────┘'
      ];

      return [makeTable,expected];
    });

    it('colSpan width expansion - specified widths',function(){
      function makeTable(){
        var table = new Table({colWidths:[4],style:{head:[],border:[]}});

        table.push(
          [{colSpan:2,content:'hello there'}],
          ['hi',{hAlign:'center',content:'hi'}]
        );

        return table;
      }

      var expected = [
          '┌─────────────┐'
        , '│ hello there │'
        , '├────┬────────┤'
        , '│ hi │   hi   │'
        , '└────┴────────┘'
      ];

      return [makeTable, expected];
    });

    it('colSpan width expansion - null widths',function(){
      function makeTable(){
        var table = new Table({colWidths:[null, 4],style:{head:[],border:[]}});

        table.push(
          [{colSpan:2,content:'hello there'}],
          [{hAlign:'right',content:'hi'}, 'hi']
        );

        return table;
      }

      var expected = [
          '┌─────────────┐'
        , '│ hello there │'
        , '├────────┬────┤'
        , '│     hi │ hi │'
        , '└────────┴────┘'
      ];

      return [makeTable,expected];
    });

    it('colorful truncation',function(){
      function makeTable(){
        var table = new Table({colWidths:[5],style:{head:[],border:[]}});

        table.push([colors.red('hello')]);

        return table;
      }

      var expected = [
          '┌─────┐'
        , '│ ' + colors.red('he') + '… │'
        , '└─────┘'
      ];

      return [makeTable,expected];
    });
  };






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