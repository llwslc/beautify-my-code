
var Linter = require('eslint').Linter;
var CLIEngine = require('eslint').CLIEngine;
var eslintrc = require('../eslint/eslintrc');

var config = new CLIEngine({
  baseConfig: eslintrc,
  useEslintrc: false
}).config.baseConfig;

var eslint = function (rawText, jsLang, vscode)
{
  var linter = new Linter();
  var eslintRes = linter.verify(rawText, config);
  var indentLen = jsLang ? 0 : 2;

  var diagnostics = [];
  eslintRes.forEach(function (res)
  {
    console.log(res);
    if (res.ruleId === 'quotes' && res.source[res.column - 1] === '`')
    {
      // null
    }
    else
    {
      var codeLine = res.line - 1;
      var codeColumn = res.column - 1 + indentLen;
      var errLen = 0;
      if (res.fix) errLen = res.fix.range[1] - res.fix.range[0];
      var range = new vscode.Range(codeLine, codeColumn, codeLine, (codeColumn + errLen));
      var msg = `[ESLint] ${res.message} (${res.ruleId})`;
      var diagnostic = new vscode.Diagnostic(range, msg);
      diagnostic.code = 0;

      diagnostics.push(diagnostic);
    }
  });

  return diagnostics;
};

module.exports = (...args) => eslint(...args);
