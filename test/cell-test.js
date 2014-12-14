describe('Cell',function(){
  var chai = require('chai');
  var expect = chai.expect;

  var Cell = require('../src/cell');

  function defaultOptions(){
    return {
      chars: {
        'top': '─'
        , 'top-mid': '┬'
        , 'top-left': '┌'
        , 'top-right': '┐'
        , 'bottom': '─'
        , 'bottom-mid': '┴'
        , 'bottom-left': '└'
        , 'bottom-right': '┘'
        , 'left': '│'
        , 'left-mid': '├'
        , 'mid': '─'
        , 'mid-mid': '┼'
        , 'right': '│'
        , 'right-mid': '┤'
        , 'middle': '│'
      }
      , truncate: '…'
      , colWidths: []
      , rowHeights: []
      , colAligns: []
      , style: {
        'padding-left': 1
        , 'padding-right': 1
        , head: ['red']
        , border: ['grey']
        , compact : false
      }
      , head: []
    };
  }

  describe('init',function(){
    describe('chars',function(){
      it('unset chars take on value of table',function(){
        var cell = new Cell();
        cell.init(defaultOptions());
        expect(cell.chars).to.eql(defaultOptions().chars);
      });

      it('set chars override the value of table',function(){
        var cell = new Cell({chars:{top:'='}});
        cell.init(defaultOptions());
        var options = defaultOptions();
        options.chars.top = '=';
        expect(cell.chars).to.eql(options.chars);
      });
    });

    describe('truncate',function(){
      it('if unset takes on value of table',function(){
        var cell = new Cell();
        cell.init(defaultOptions());
        expect(cell.truncate).to.equal('…');
      });

      it('if set overrides value of table',function(){
        var cell = new Cell({truncate:'...'});
        cell.init(defaultOptions());
        expect(cell.truncate).to.equal('...');
      });
    });

    describe('hAlign',function(){
      it('if unset takes colAlign value from tableOptions',function(){
        var tableOptions = defaultOptions();
        tableOptions.colAligns = ['left','right','both'];
        var cell = new Cell();
        cell.init(tableOptions,0);
        expect(cell.hAlign).to.equal('left');
        cell = new Cell();
        cell.init(tableOptions,1);
        expect(cell.hAlign).to.equal('right');
        cell = new Cell();
        cell.init(tableOptions,2);
        expect(cell.hAlign).to.equal('both');
      });

      it('if set overrides tableOptions',function(){
        var tableOptions = defaultOptions();
        tableOptions.colAligns = ['left','right','both'];
        var cell = new Cell({hAlign:'right'});
        cell.init(tableOptions,0);
        expect(cell.hAlign).to.equal('right');
        cell = new Cell({hAlign:'left'});
        cell.init(tableOptions,1);
        expect(cell.hAlign).to.equal('left');
        cell = new Cell({hAlign:'right'});
        cell.init(tableOptions,2);
        expect(cell.hAlign).to.equal('right');
      });
    });

    describe('width', function(){
      it('will match colWidth of x',function(){
        var cell = new Cell();
        var tableOptions = defaultOptions();
        tableOptions.colWidths = [5,10,15];
        cell.init(tableOptions,0);
        expect(cell.width).to.equal(5);
        cell = new Cell();
        cell.init(tableOptions,1);
        expect(cell.width).to.equal(10);
        cell = new Cell();
        cell.init(tableOptions,2);
        expect(cell.width).to.equal(15);
      });

      it('will add colWidths if colSpan > 1',function(){
        var cell = new Cell({colSpan:2});
        var tableOptions = defaultOptions();
        tableOptions.colWidths = [5,10,15];
        cell.init(tableOptions,0);
        expect(cell.width).to.equal(16);
        cell = new Cell({colSpan:2});
        cell.init(tableOptions,1);
        expect(cell.width).to.equal(26);
        cell = new Cell({colSpan:3});
        cell.init(tableOptions,0);
        expect(cell.width).to.equal(32);
      });
    });

    describe('height', function(){
      it('will match rowHeight of x',function(){
        var cell = new Cell();
        var tableOptions = defaultOptions();
        tableOptions.rowHeights = [5,10,15];
        cell.init(tableOptions,0,0);
        expect(cell.height).to.equal(5);
        cell = new Cell();
        cell.init(tableOptions,0,1);
        expect(cell.height).to.equal(10);
        cell = new Cell();
        cell.init(tableOptions,0,2);
        expect(cell.height).to.equal(15);
      });

      it('will add rowHeights if rowSpan > 1',function(){
        var cell = new Cell({rowSpan:2});
        var tableOptions = defaultOptions();
        tableOptions.rowHeights = [5,10,15];
        cell.init(tableOptions,0,0);
        expect(cell.height).to.equal(16);
        cell = new Cell({rowSpan:2});
        cell.init(tableOptions,0,1);
        expect(cell.height).to.equal(26);
        cell = new Cell({rowSpan:3});
        cell.init(tableOptions,0,0);
        expect(cell.height).to.equal(32);
      });
    });

    describe('style.padding-left', function () {
      it('if unset will be copied from tableOptions.style', function () {
        var cell = new Cell();
        cell.init(defaultOptions());
        expect(cell.paddingLeft).to.equal(1);

        cell = new Cell();
        var tableOptions = defaultOptions();
        tableOptions.style['padding-left'] = 2;
        cell.init(tableOptions);
        expect(cell.paddingLeft).to.equal(2);

        cell = new Cell();
        tableOptions = defaultOptions();
        tableOptions.style.paddingLeft = 3;
        cell.init(tableOptions);
        expect(cell.paddingLeft).to.equal(3);
      });

      it('if set will override tableOptions.style', function () {
        var cell = new Cell({style:{'padding-left':2}});
        cell.init(defaultOptions());
        expect(cell.paddingLeft).to.equal(2);

        cell = new Cell({style:{paddingLeft:3}});
        cell.init(defaultOptions());
        expect(cell.paddingLeft).to.equal(3);
      });
    });
    
    describe('style.padding-right', function () {
      it('if unset will be copied from tableOptions.style', function () {
        var cell = new Cell();
        cell.init(defaultOptions());
        expect(cell.paddingRight).to.equal(1);

        cell = new Cell();
        var tableOptions = defaultOptions();
        tableOptions.style['padding-right'] = 2;
        cell.init(tableOptions);
        expect(cell.paddingRight).to.equal(2);

        cell = new Cell();
        tableOptions = defaultOptions();
        tableOptions.style.paddingRight = 3;
        cell.init(tableOptions);
        expect(cell.paddingRight).to.equal(3);
      });

      it('if set will override tableOptions.style', function () {
        var cell = new Cell({style:{'padding-right':2}});
        cell.init(defaultOptions());
        expect(cell.paddingRight).to.equal(2);

        cell = new Cell({style:{paddingRight:3}});
        cell.init(defaultOptions());
        expect(cell.paddingRight).to.equal(3);
      });
    });

    it('will set x and y',function(){
       var cell = new Cell();
      cell.init(defaultOptions(),0,0);
      expect(cell.x).to.equal(0);
      expect(cell.y).to.equal(0);

      cell = new Cell();
      cell.init(defaultOptions(),3,4);
      expect(cell.x).to.equal(3);
      expect(cell.y).to.equal(4);
    });
  });

  describe('drawLine', function(){
    var cell;

    beforeEach(function () {
      cell = new Cell();

      //manually init
      cell.chars = defaultOptions().chars;
      cell.paddingLeft = cell.paddingRight = 1;
      cell.width = 7;
      cell.height = 2;
      cell.hAlign = 'center';
      cell.chars.left = 'L';
      cell.chars.right = 'R';
      cell.chars.middle = 'M';
      cell.content = 'hello\nhowdy\ngoodnight';
      cell.x = cell.y = 0;
    });

    describe('top line',function(){
      it('will draw the top left corner when x=0,y=0',function(){
        cell.x = cell.y = 0;
        expect(cell.drawLine(0)).to.equal('┌───────');
        expect(cell.drawLine(0,true)).to.equal('┌───────┐');
      });

      it('will draw the top mid corner when x=1,y=0',function(){
        cell.x = 1;
        cell.y = 0;
        expect(cell.drawLine(0)).to.equal('┬───────');
        expect(cell.drawLine(0,true)).to.equal('┬───────┐');
      });

      it('will draw the left mid corner when x=0,y=1',function(){
        cell.x = 0;
        cell.y = 1;
        expect(cell.drawLine(0)).to.equal('├───────');
        expect(cell.drawLine(0,true)).to.equal('├───────┤');
      });

      it('will draw the mid mid corner when x=1,y=1',function(){
        cell.x = 1;
        cell.y = 1;
        expect(cell.drawLine(0)).to.equal('┼───────');
        expect(cell.drawLine(0,true)).to.equal('┼───────┤');
      });
    });

    describe('bottom line',function(){
      it('will draw the bottom left corner if x=0',function(){
        cell.x = 0;
        cell.y = 1;
        expect(cell.drawBottom()).to.equal('└───────');
        expect(cell.drawBottom(true)).to.equal('└───────┘');
      });

      it('will draw the bottom left corner if x=1',function(){
        cell.x = 1;
        cell.y = 1;
        expect(cell.drawBottom()).to.equal('┴───────');
        expect(cell.drawBottom(true)).to.equal('┴───────┘');
      });
    });

    describe('first line of text',function(){
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0',function(){
        cell.x = 0;
        expect(cell.drawLine(1)).to.equal('L  hello  ');
        expect(cell.drawLine(1,true)).to.equal('L  hello  R');
      });

      it('will draw mid side if x=1',function(){
        cell.x = 1;
        expect(cell.drawLine(1)).to.equal('M  hello  ');
        expect(cell.drawLine(1,true)).to.equal('M  hello  R');
      });

      it('will align left',function(){
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.drawLine(1)).to.equal('M hello   ');
        expect(cell.drawLine(1,true)).to.equal('M hello   R');
      });

      it('will align right',function(){
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.drawLine(1)).to.equal('M   hello ');
        expect(cell.drawLine(1,true)).to.equal('M   hello R');
      });
    });    
    
    describe('second line of text',function(){
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0',function(){
        cell.x = 0;
        expect(cell.drawLine(2)).to.equal('L  howdy  ');
        expect(cell.drawLine(2,true)).to.equal('L  howdy  R');
      });

      it('will draw mid side if x=1',function(){
        cell.x = 1;
        expect(cell.drawLine(2)).to.equal('M  howdy  ');
        expect(cell.drawLine(2,true)).to.equal('M  howdy  R');
      });

      it('will align left',function(){
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.drawLine(2)).to.equal('M howdy   ');
        expect(cell.drawLine(2,true)).to.equal('M howdy   R');
      });

      it('will align right',function(){
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.drawLine(2)).to.equal('M   howdy ');
        expect(cell.drawLine(2,true)).to.equal('M   howdy R');
      });
    });    
    
    describe('truncated line of text',function(){
      beforeEach(function () {
        cell.width = 9;
      });

      it('will draw left side if x=0',function(){
        cell.x = 0;
        expect(cell.drawLine(3)).to.equal('L goodni… ');
        expect(cell.drawLine(3,true)).to.equal('L goodni… R');
      });

      it('will draw mid side if x=1',function(){
        cell.x = 1;
        expect(cell.drawLine(3)).to.equal('M goodni… ');
        expect(cell.drawLine(3,true)).to.equal('M goodni… R');
      });

      it('will align left',function(){
        cell.x = 1;
        cell.hAlign = 'left';
        expect(cell.drawLine(3)).to.equal('M goodni… ');
        expect(cell.drawLine(3,true)).to.equal('M goodni… R');
      });

      it('will align right',function(){
        cell.x = 1;
        cell.hAlign = 'right';
        expect(cell.drawLine(3)).to.equal('M goodni… ');
        expect(cell.drawLine(3,true)).to.equal('M goodni… R');
      });
    });
  });
});

