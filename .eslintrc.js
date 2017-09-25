module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'prettier',
  globals: {
    __static: true,
  },
  plugins: [
    'html',
    'prettier'
  ],
  'rules': {
    'prettier/prettier': 'error'
  }
}
