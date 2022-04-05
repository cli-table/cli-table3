##### Basic Usage
![table image](./examples/screenshots/basic-usage-with-colors.png)
```javascript
      // By default, headers will be red, and borders will be grey
      let table = new Table({ head: ['a', 'b'] });

      table.push(['c', 'd']);

```


##### Basic Usage - disable colors - (used often in the examples and tests)
    ┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐
    │ Rel  │ Change              │ By                      │ When            │
    ├──────┼─────────────────────┼─────────────────────────┼─────────────────┤
    │ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │
    ├──────┼─────────────────────┼─────────────────────────┼─────────────────┤
    │ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │
    └──────┴─────────────────────┴─────────────────────────┴─────────────────┘
```javascript
      // For most of these examples, and most of the unit tests we disable colors.
      // It makes unit tests easier to write/understand, and allows these pages to
      // display the examples as text instead of screen shots.
      let table = new Table({
        head: ['Rel', 'Change', 'By', 'When'],
        style: {
          head: [], //disable colors in header cells
          border: [], //disable colors for the border
        },
        colWidths: [6, 21, 25, 17], //set the widths of each column (optional)
      });

      table.push(
        ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago'],
        ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
      );

```


##### Create vertical tables by adding objects a that specify key-value pairs
    ┌────┬──────────────────────┐
    │v0.1│Testing something cool│
    ├────┼──────────────────────┤
    │v0.1│Testing something cool│
    └────┴──────────────────────┘
```javascript
      let table = new Table({
        style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
      });

      table.push(
        { 'v0.1': 'Testing something cool' },
        { 'v0.1': 'Testing something cool' }
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
      let table = new Table({
        head: ['', 'Header 1', 'Header 2'],
        style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
      }); // clear styles to prevent color output

      table.push(
        { 'Header 3': ['v0.1', 'Testing something cool'] },
        { 'Header 4': ['v0.1', 'Testing something cool'] }
      );

```


##### Stylize the table with custom border characters
    ╔══════╤═════╤══════╗
    ║ foo  │ bar │ baz  ║
    ╟──────┼─────┼──────╢
    ║ frob │ bar │ quuz ║
    ╚══════╧═════╧══════╝
```javascript
      let table = new Table({
        chars: {
          top: '═',
          'top-mid': '╤',
          'top-left': '╔',
          'top-right': '╗',
          bottom: '═',
          'bottom-mid': '╧',
          'bottom-left': '╚',
          'bottom-right': '╝',
          left: '║',
          'left-mid': '╟',
          right: '║',
          'right-mid': '╢',
        },
        style: {
          head: [],
          border: [],
        },
      });

      table.push(
        ['foo', 'bar', 'baz'],
        ['frob', 'bar', 'quuz']
      );

```


##### Use ansi colors (i.e. colors.js) to style text within the cells at will, even across multiple lines
![table image](./examples/screenshots/multi-line-colors.png)
```javascript
      let table = new Table({ style: { border: [], header: [] } });

      table.push([colors.red('Hello\nhow\nare\nyou?'), colors.blue('I\nam\nfine\nthanks!')]);

```


##### Set `wordWrap` to true to wrap text on word boundaries
    ┌───────┬─────────┬───────────────────┬──────────────┐
    │ Hello │ I am    │ Words that exceed │ Text is only │
    │ how   │ fine    │ the colWidth will │ wrapped for  │
    │ are   │ thanks! │ be truncated.     │ fixed width  │
    │ you?  │ Looooo… │                   │ columns.     │
    └───────┴─────────┴───────────────────┴──────────────┘
```javascript
      let table = new Table({
        style: { border: [], header: [] },
        colWidths: [7, 9], // Requires fixed column widths
        wordWrap: true,
      });

      table.push([
        'Hello how are you?',
        'I am fine thanks! Looooooong',
        ['Words that exceed', 'the colWidth will', 'be truncated.'].join('\n'),
        ['Text is only', 'wrapped for', 'fixed width', 'columns.'].join('\n'),
      ]);

```


##### Using `wordWrap`, set `wrapOnWordBoundary` to false to ignore word boundaries
    ┌───┬───┐
    │ W │ T │
    │ r │ e │
    │ a │ x │
    │ p │ t │
    └───┴───┘
```javascript
      const table = new Table({
        style: { border: [], header: [] },
        colWidths: [3, 3], // colWidths must all be greater than 2!!!!
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      table.push(['Wrap', 'Text']);
```


##### Supports hyperlinking cell content using the href option
    ┌───────────┬─────┬─────┐
    │ Text Link │ Hel │ htt │
    │           │ lo  │ p:/ │
    │           │ Lin │ /ex │
    │           │ k   │ amp │
    │           │     │ le. │
    │           │     │ com │
    ├───────────┴─────┴─────┤
    │ http://example.com    │
    └───────────────────────┘
    
    Note: Links are not displayed in documentation examples.
```javascript
      const table = new Table({
        colWidths: [11, 5, 5],
        style: { border: [], head: [] },
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      const href = 'http://example.com';
      table.push(
        [{ content: 'Text Link', href }, { content: 'Hello Link', href }, { href }],
        [{ href, colSpan: 3 }]
      );
```

