# cli-table3 generation script

This experimental [generate script](./generate.js) is a utility primarily suited for testing,
debugging, experimenting, and having fun with cli-table3!

While this script is mainly purposed for developers/contributors of cli-table3,
some might find it useful for getting started.

## Basic usage

```
➭ node scripts/generate [ROWS = 10] [COLS = 10] [options]

When installing this package:
➭ node node_modules/cli-table3/scripts/generate 10 5 --print

When cloning this repository:
➭ node scripts/generate 10 5 --print
```

Note: Options can be specified without specifying rows and cols but must come
last if rows and cols are specified.

_See available options._

## Features

* Generate basic tables
* Generate complex tables
* Performance testing
* Optionally output usable code for generated tables

### Generate basic tables

Basic table generation produces only simple 1x1 cells. Eg.

```
➭ node script/generate 5 4 --print
```

Outputs:

```
┌───────────┬───────────┬───────────┬───────────┬───────────┬───────────┐
│ 0-0 (1x1) │ 0-1 (1x1) │ 0-2 (1x1) │ 0-3 (1x1) │ 0-4 (1x1) │ 0-5 (1x1) │
├───────────┼───────────┼───────────┼───────────┼───────────┼───────────┤
│ 1-0 (1x1) │ 1-1 (1x1) │ 1-2 (1x1) │ 1-3 (1x1) │ 1-4 (1x1) │ 1-5 (1x1) │
├───────────┼───────────┼───────────┼───────────┼───────────┼───────────┤
│ 2-0 (1x1) │ 2-1 (1x1) │ 2-2 (1x1) │ 2-3 (1x1) │ 2-4 (1x1) │ 2-5 (1x1) │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
Memory usage at startup: 2.6648712158203125mb
Memory usage after table build: 2.6932601928710938mb
table built in 0.305 ms
Memory usage after table rendered: 3.2284088134765625mb
table rendered in 16.506 ms
```

### Generate complex tables

Complex tables can include cells that span multiple rows and/or columns.

```
➭ node script/generate --complex --print
```

**Randomly** outputs something like:

```
┌─────────────────────────┬───────────┬───────────┐
│ 0-0 (6x8)               │ 0-8 (6x1) │ 0-9 (4x1) │
│                         │           │           │
│                         │           │           │
│                         │           │           │
│                         │           │           │
│                         │           │           │
│                         │           │           │
│                         │           ├───────────┤
│                         │           │ 4-9 (4x1) │
│                         │           │           │
│                         │           │           │
├─────────────────────────┼───────────┤           │
│ 6-0 (2x8)               │ 6-8 (1x1) │           │
│                         ├───────────┤           │
│                         │ 7-8 (2x1) │           │
├─────────────────────────┤           ├───────────┤
│ 8-0 (1x8)               │           │ 8-9 (1x1) │
├─────────┬───────────┬───┴───────────┼───────────┤
│ 9-0 (1… │ 9-5 (1x1) │ 9-6 (1x3)     │ 9-9 (1x1) │
└─────────┴───────────┴───────────────┴───────────┘
```

Limits for rowSpans and colSpans are determined based on the number rows & cols.

_Complex table generation is prone to using up the rowSpans toward the top of
the table._


### Performance testing

This script was primarily developed for testing performance (manually). By
default, that's all it does. Observe memory usage and rendering time when
generating tables with this script. Eg.

```
➭ node script/generate
```

Outputs:

```
Memory usage at startup: 2.6579513549804688mb
Memory usage after table build: 2.7062149047851562mb
table built in 0.325 ms
Memory usage after table rendered: 4.779487609863281mb
table rendered in 23.820 ms
```

## Generate table code

Use the `--dump` option to output code for the table that is generated. Eg.

```
➭ node script/generate 5 6 --dump
```

Outputs:

```
const table = new Table();
table.push(
  ['0-0 (1x1)','0-1 (1x1)','0-2 (1x1)','0-3 (1x1)','0-4 (1x1)','0-5 (1x1)']
  ['1-0 (1x1)','1-1 (1x1)','1-2 (1x1)','1-3 (1x1)','1-4 (1x1)','1-5 (1x1)']
  ['2-0 (1x1)','2-1 (1x1)','2-2 (1x1)','2-3 (1x1)','2-4 (1x1)','2-5 (1x1)']
  ['3-0 (1x1)','3-1 (1x1)','3-2 (1x1)','3-3 (1x1)','3-4 (1x1)','3-5 (1x1)']
  ['4-0 (1x1)','4-1 (1x1)','4-2 (1x1)','4-3 (1x1)','4-4 (1x1)','4-5 (1x1)']
);
console.log(table.toString());
Memory usage at startup: 2.689239501953125mb
Memory usage after table build: 2.721099853515625mb
table built in 0.300 ms
Memory usage after table rendered: 3.4740676879882812mb
table rendered in 18.327 ms
```

#### Generate complex table code:

```
➭ node script/generate --dump --complex
```

**Randomly** generates something like:

```
const table = new Table();
table.push(
  [
    { content: '0-0 (1x3)', colSpan: 3, rowSpan: 1 },
    { content: '0-3 (1x1)', colSpan: 1, rowSpan: 1 },
    { content: '0-4 (1x1)', colSpan: 1, rowSpan: 1 },
  ],
  [
    { content: '1-0 (2x4)', colSpan: 4, rowSpan: 2 },
    { content: '1-4 (2x1)', colSpan: 1, rowSpan: 2 },
  ],
  [],
  [
    { content: '3-0 (1x1)', colSpan: 1, rowSpan: 1 },
    { content: '3-1 (1x3)', colSpan: 3, rowSpan: 1 },
    { content: '3-4 (1x1)', colSpan: 1, rowSpan: 1 },
  ],
);
console.log(table.toString());
Memory usage at startup: 3.0095062255859375mb
Memory usage after table build: 3.0915908813476562mb
table built in 1.477 ms
Memory usage after table rendered: 4.018150329589844mb
table rendered in 11.284 ms
```

## Generation Options

## Warranty

This script is provided as is and it's functionality is not guranteed to match
what has been described above.
