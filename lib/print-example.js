/* eslint-env jest */
/* eslint-disable no-console */

const colors = require('@colors/colors/safe');
const fs = require('fs');

function logExample(fn) {
  runPrintingExample(
    fn,
    function logName(name) {
      console.log(colors.gray('=========  ') + name + colors.gray('  ================'));
    },
    console.log, //logTable
    console.log, //logCode
    console.log, //logSeparator
    identity //screenShot
  );
}

function replaceLinks(str) {
  const matches = str.match(/\x1B\]8;;[^\x07]+\x07[^\]]+\x1B\]8;;\x07/g);
  if (matches) {
    matches.forEach((match) => {
      const [, text] = match.match(/\x07([^\]|\x1B]+)\x1B/);
      str = str.replace(match, text);
    });
    str += '\n\nNote: Links are not displayed in documentation examples.';
  }
  return str;
}

function mdExample(fn, file, cb) {
  let buffer = [];

  runPrintingExample(
    fn,
    function logName(name) {
      buffer.push('##### ' + name);
    },
    function logTable(table) {
      //md files won't render color strings properly.
      table = replaceLinks(stripColors(table));

      // indent table so is displayed preformatted text
      table = '    ' + table.split('\n').join('\n    ');

      buffer.push(table);
    },
    function logCode(code) {
      buffer.push('```javascript');
      buffer.push(stripColors(code));
      buffer.push('```');
    },
    function logSeparator(sep) {
      buffer.push(stripColors(sep));
    },
    function logScreenShot(image) {
      buffer.push('![table image](./examples/screenshots/' + image + '.png)');
    }
  );

  fs.writeFileSync(file, buffer.join('\n'));

  if (cb) {
    cb();
  }
}

/**
 * Actually runs the tests and verifies the functions create the expected output.
 * @param name of the test suite, used in the mocha.describe call.
 * @param fn a function which creates the test suite.
 */
function runTest(name, fn) {
  function testExample(name, fn, expected) {
    it(name, function () {
      expect(fn().toString()).toEqual(expected.join('\n'));
    });
  }

  describe(name, function () {
    fn(testExample, identity);
  });
}

/**
 * Common execution for runs that print output (either to console or to a Markdown file);
 * @param fn - a function containing the tests/demos.
 * @param logName - callback to print the name of this test to the console or file.
 * @param logTable - callback to print the output of the table to the console or file.
 * @param logCode - callback to print the output of the table to the console or file.
 * @param logSeparator - callback to print extra whitespace between demos.
 * @param logScreenShot - write out a link to the screenShot image.
 */
function runPrintingExample(fn, logName, logTable, logCode, logSeparator, logScreenShot) {
  /**
   * Called by every test/demo
   * @param name - the name of this test.
   * @param makeTable - a function which builds the table under test. Also, The contents of this function will be printed.
   * @param expected -  The expected result.
   * @param screenshot - If present, there is an image containing a screenshot of the output
   */
  function printExample(name, makeTable, expected, screenshot) {
    let code = makeTable.toString().split('\n').slice(1, -2).join('\n');

    logName(name);
    if (screenshot && logScreenShot) {
      logScreenShot(screenshot);
    } else {
      logTable(makeTable().toString());
    }
    logCode(code);
    logSeparator('\n');
  }

  fn(printExample);
}

// removes all the color characters from a string
function stripColors(str) {
  return str.split(/\u001b\[(?:\d*;){0,5}\d*m/g).join('');
}

// returns the first arg - used as snapshot function
function identity(str) {
  return str;
}

module.exports = {
  mdExample: mdExample,
  logExample: logExample,
  runTest: runTest,
};
