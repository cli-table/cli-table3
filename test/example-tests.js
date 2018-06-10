const printExamples = require('../lib/print-example');
const examples = require('../examples/col-and-row-span-examples');
const usage = require('../examples/basic-usage-examples');

printExamples.runTest('@api Usage', usage);
printExamples.runTest('@api Table (examples)', examples);
