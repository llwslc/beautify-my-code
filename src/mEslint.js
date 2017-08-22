
var Linter = require('eslint').Linter;
var CLIEngine = require('eslint').CLIEngine;
var eslintrc = require('../eslint/eslintrc');

var config = new CLIEngine({
  baseConfig: eslintrc,
  useEslintrc: false
}).config.baseConfig;

var eslint = function (rawText)
{
  var linter = new Linter();

  return linter.verify(rawText, config);
};

module.exports = (...args) => eslint(...args);
