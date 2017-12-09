module.exports = {
  parserOptions: {
    ecmaVersion: 7
  },
  plugins: ['prettier'],
  rules: {
    'import/no-commonjs': 0,
    'no-console': 0,
    'prettier/prettier': 'error'
  },
  extends: ['recommended/node', 'prettier', 'prettier/standard']
}
