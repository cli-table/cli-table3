const Table = require('..');

const cellContent = ({ x, y, colSpan = 1, rowSpan = 1 }) => {
  return `${y}-${x} (${rowSpan}x${colSpan})`;
};

const generateBasicTable = (rows, cols, options = {}) => {
  const table = new Table(options);
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push(cellContent({ y, x }));
    }
    table.push(row);
  }
  return table;
};

const randomNumber = (min, max, op = 'round') => {
  return Math[op](Math.random() * (max - min) + min);
};

const next = (alloc, idx, dir = 1) => {
  if (alloc[idx]) {
    return next(alloc, idx + 1 * dir);
  }
  return idx;
};

const generateComplexRow = (y, spanX, cols, alloc, options = {}) => {
  let x = next(alloc, 0);
  const row = [];
  while (x < cols) {
    const { colSpans = {} } = options;
    const opt = {
      colSpan: colSpans[x] || next(alloc, randomNumber(x + 1, options.maxCols || cols, 'ceil'), -1) - x,
      rowSpan: randomNumber(1, spanX),
    };
    row.push({ content: cellContent({ y, x, ...opt }), ...opt });
    if (opt.rowSpan > 1) {
      for (let i = 0; i < opt.colSpan; i++) {
        alloc[x + i] = opt.rowSpan;
      }
    }

    x = next(alloc, x + opt.colSpan);
  }
  return row;
};

const generateComplexRows = (y, rows, cols, alloc = {}, options = {}) => {
  const remaining = rows - y;
  let spanX = remaining > 1 ? randomNumber(1, remaining) : 1;
  let lines = [];
  while (spanX > 0) {
    lines.push(generateComplexRow(y, spanX, cols, alloc, options));
    y++;
    spanX--;
    Object.keys(alloc).forEach((idx) => {
      alloc[idx]--;
      if (alloc[idx] <= 0) delete alloc[idx];
    });
  }
  return lines;
};

const generateComplexTable = (rows, cols, options = {}) => {
  const table = new Table(options.tableOptions);
  while (table.length < rows) {
    let y = table.length || (table.options.head && 1) || 0;
    generateComplexRows(y, rows, cols, options).forEach((row) => table.push(row));
  }
  return table;
};

module.exports = {
  generateBasicTable,
  generateComplexTable,
  generateComplexRow,
};
