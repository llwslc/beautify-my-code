
var vscode = require('vscode');
var common = require('./common');
var mVueBeautify = require('./mVueBeautify');
var mJsBeautify = require('./mJsBeautify');
var mEsLint = require('./mEsLint');

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
    var newText = '';

    if (!myConfig.function_setting.format_on_save) return;

    editorText = doc.getText();
    if (doc.languageId === common.jsLanguageId || doc.languageId === common.jsonLanguageId)
    {
      newText = mJsBeautify(editorText, myConfig, doc.languageId);
    }
    else if (doc.languageId === common.vueLanguageId)
    {
      newText = mVueBeautify(editorText, myConfig, doc.languageId);
    }
    else
    {
      return;
    }

    var fullRange = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    var we = new vscode.WorkspaceEdit();

    we.replace(doc.uri, fullRange, newText);
    vscode.workspace.applyEdit(we);

    if (!myConfig.other_setting.eslint_on_save) return;

    if (doc.languageId !== common.jsLanguageId) return;

    editorText = doc.getText();
    var eslintRes = mEsLint(editorText);

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
        var codeColumn = res.column - 1;
        var errLen = 0;
        if (!!res.fix) errLen = res.fix.range[1] - res.fix.range[0];
        var range = new vscode.Range(codeLine, codeColumn, codeLine, (codeColumn + errLen));
        var msg = `[ESLint] ${res.message} (${res.ruleId})`;
        var diagnostic = new vscode.Diagnostic(range, msg);
        diagnostic.code = 0;

        diagnostics.push(diagnostic);
      }
    });

    diagnosticCollection.set(doc.uri, diagnostics);
  });

  vscode.workspace.onDidChangeConfiguration(function ()
  {
    getCfg();
  });

  vscode.commands.registerCommand('eslintrc.edit', function ()
  {
    vscode.workspace.openTextDocument(`${context.extensionPath}/eslint/eslintrc.js`)
      .then(doc => vscode.window.showTextDocument(doc, 1, false));
  });


  getCfg();
};

exports.deactivate = function () {};
