module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-control-regex': 'off',
  },
  overrides: [
    {
      // tests
      files: ['test/**/*.js', 'test/**/*.ts'],
      env: {
        node: true,
        jest: true,
      },
    },
    {
      files: ['test/**/*.ts', 'index.d.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: "module",
      },
    }
  ],
};
