module.exports = {
  singleQuote: true,
  useTabs: false,
  printWidth: 180,
  tabWidth: 2,
  semi: true,
  htmlWhitespaceSensitivity: 'strict',
  arrowParens: 'avoid',
  bracketSpacing: true,
  proseWrap: 'preserve',
  trailingComma: 'none',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html'
      }
    },
    {
      files: '*.component.html',
      options: {
        parser: 'angular'
      }
    }
  ]
};
