
const Linter = require('eslint').Linter;
const CLIEngine = require('eslint').CLIEngine;
const eslintrc = require('../eslint/eslintrc');

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
