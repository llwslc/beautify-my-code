
const Linter = require('eslint').Linter;
const eslintrc = require('../eslint/eslintrc');

var eslint = function (rawText)
{
  var linter = new Linter();

  return linter.verify(rawText, eslintrc);
}

module.exports = (...args) => eslint(...args);
