
var vscode = require('vscode');
var mJsBeautify = require('./mJsBeautify');
var mEsLint = require('./mEsLint');

var jsLanguageId = 'javascript';
var jsonLanguageId = 'json';

var extensionName = require('../package').name;

exports.activate = function (context)
{
  var myConfig = {};
  var diagnosticCollection = vscode.languages.createDiagnosticCollection(extensionName);

  var getCfg = function ()
  {
    myConfig = vscode.workspace.getConfiguration(extensionName);
  };

  vscode.workspace.onWillSaveTextDocument(function (event)
  {
    var doc = event.document;
    var editorText = '';

    if (!myConfig.function_setting.format_on_save) return;

    if (doc.languageId !== jsLanguageId && doc.languageId !== jsonLanguageId) return;

    editorText = doc.getText();
    var newText = mJsBeautify(editorText, myConfig, doc.languageId);

    var fullRange = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    var we = new vscode.WorkspaceEdit();

    we.replace(doc.uri, fullRange, newText);
    vscode.workspace.applyEdit(we);

    if (!myConfig.other_setting.eslint_on_save) return;

    if (doc.languageId !== jsLanguageId) return;

    editorText = doc.getText();
    var eslintRes = mEsLint(editorText);

    var diagnostics = [];
    eslintRes.forEach(function (res)
    {
      var codeLine = res.line - 1;
      var codeColumn = res.column - 1;
      var errLen = res.fix.range[1] - res.fix.range[0];
      var range = new vscode.Range(codeLine, codeColumn, codeLine, (codeColumn + errLen));
      var msg = `[ESLint] ${res.ruleId}: ${res.message}`;
      var diagnostic = new vscode.Diagnostic(range, msg);
      diagnostic.code = 0;

      diagnostics.push(diagnostic);
    });

    diagnosticCollection.set(doc.uri, diagnostics);
  });

  vscode.workspace.onDidChangeConfiguration(function ()
  {
    getCfg();
  });

  getCfg();
};

exports.deactivate = function () {};
