var printExample = require('../lib/print-example');

printExample.mdExample(require('../examples/basic-usage-examples'), 'basic-usage.md');
printExample.mdExample(require('../examples/col-and-row-span-examples'), 'advanced-usage.md');
