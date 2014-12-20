##### Basic Usage
![table image](https://cdn.rawgit.com/jamestalmage/cli-table2/d4266014c8858ae25bdba4f7c7c9d5682e0d544b/examples/screenshots/basic-usage-with-colors.png)
```javascript
      // By default, headers will be red, and borders will be grey
      // Those defaults are overwritten in a lot of these examples and within the tests.
      // It makes unit tests easier and visually cleaner,  and does not require a screenshot image.
      var table = new Table({head:['a','b']});

      table.push(['c','d']);

```


##### Basic Usage - No color styles
    ┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐
    │ Rel  │ Change              │ By                      │ When            │
    ├──────┼─────────────────────┼─────────────────────────┼─────────────────┤
    │ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │
    ├──────┼─────────────────────┼─────────────────────────┼─────────────────┤
    │ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │
    └──────┴─────────────────────┴─────────────────────────┴─────────────────┘
```javascript
      var table = new Table({
        head: ['Rel', 'Change', 'By', 'When']
        , style: {
          'padding-left': 1
          , 'padding-right': 1
          , head: []    //overriding header style to not use colors
          , border: []  //overriding border style to not use colors
        }
        , colWidths: [6, 21, 25, 17]
      });

      table.push(
          ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
        , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
      );

```


##### Create vertical tables by adding objects a single key that contains an array
    ┌────┬──────────────────────┐
    │v0.1│Testing something cool│
    ├────┼──────────────────────┤
    │v0.1│Testing something cool│
    └────┴──────────────────────┘
```javascript
      var table = new Table({ style: {'padding-left':0, 'padding-right':0, head:[], border:[]} });

      table.push(
          {'v0.1': 'Testing something cool'}
        , {'v0.1': 'Testing something cool'}
      );

```


##### Cross tables are similar to vertical tables, but include an empty string for the first header
    ┌────────┬────────┬──────────────────────┐
    │        │Header 1│Header 2              │
    ├────────┼────────┼──────────────────────┤
    │Header 3│v0.1    │Testing something cool│
    ├────────┼────────┼──────────────────────┤
    │Header 4│v0.1    │Testing something cool│
    └────────┴────────┴──────────────────────┘
```javascript
      var table = new Table({ head: ["", "Header 1", "Header 2"], style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

      table.push(
        {"Header 3": ['v0.1', 'Testing something cool'] }
        , {"Header 4": ['v0.1', 'Testing something cool'] }
      );

```


##### Stylize the table with custom border characters
    ╔══════╤═════╤══════╗
    ║ foo  │ bar │ baz  ║
    ╟──────┼─────┼──────╢
    ║ frob │ bar │ quuz ║
    ╚══════╧═════╧══════╝
```javascript
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

```

