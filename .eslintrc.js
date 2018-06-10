module.exports = {
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    'node': true,
  },
  extends: 'eslint:recommended',
  rules: {
    'no-control-regex': 'off',
  },
  overrides: [{
    // tests
    files: [
      'test/**/*.js',
    ],
    env: {
      jest: true,
    },
  }],
};
