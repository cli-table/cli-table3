const debug = require('../src/debug');
const Table = require('..');
const utils = require('../src/utils');

describe('lazy debug messages', () => {
  beforeEach(() => {
    debug.setDebugLevel(0);
    debug.reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    debug.setDebugLevel(0);
    debug.reset();
  });

  describe.each([
    ['warn', debug.WARN],
    ['info', debug.INFO],
    ['debug', debug.DEBUG],
  ])('%s', (method, level) => {
    it('does not evaluate messages below the configured level', () => {
      debug.setDebugLevel(level - 1);
      const message = jest.fn(() => 'lazy message');

      debug[method](message);

      expect(message).not.toHaveBeenCalled();
      expect(debug.debugMessages()).toEqual([]);
    });

    it('evaluates enabled messages once and preserves string messages', () => {
      debug.setDebugLevel(level);
      const message = jest.fn(() => 'lazy message');

      debug[method]('plain message');
      debug[method](message);

      expect(message).toHaveBeenCalledTimes(1);
      expect(debug.debugMessages()).toEqual(['plain message', 'lazy message']);
    });
  });

  it.each([0, 1, 2, 3])('only computes cell previews when info logging is enabled (level %i)', (level) => {
    const content = 'first line of content\nsecond line of content\nthird line of content';
    const preview = utils.truncate(content, 10, '…');
    const truncate = jest.spyOn(utils, 'truncate');
    const table = new Table({ debug: level, style: { head: [], border: [] } });
    table.push([content]);

    const output = table.toString();

    expect(output).toBe(
      [
        '┌────────────────────────┐',
        '│ first line of content  │',
        '│ second line of content │',
        '│ third line of content  │',
        '└────────────────────────┘',
      ].join('\n')
    );
    const previews = truncate.mock.calls.filter(([value, width]) => value === content && width === 10);
    expect(previews).toHaveLength(level >= debug.INFO ? 1 : 0);
    if (level >= debug.INFO) {
      expect(table.messages).toContain(`0-0: 1x1 Cell ${preview}`);
    }
  });
});
