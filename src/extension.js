
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

      if (myConfig.newline_setting.newline_at_start && doc.languageId === common.jsLanguageId)
      {
        if (newText.indexOf(`#!`))
        {
          newText = `\n${newText}`;
        }
      }
    }
    else if (doc.languageId === common.vueLanguageId)
    {
      newText = mVueBeautify(editorText, myConfig);
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

    editorText = doc.getText();
    var diagnostics = [];
    if (doc.languageId === common.jsLanguageId)
    {
      diagnostics = mEsLint(editorText, true, vscode);
    }
    else if (doc.languageId === common.vueLanguageId)
    {
      diagnostics = mEsLint(mVueBeautify.getJsCode(editorText), false, vscode);
    }
    else
    {
      return;
    }

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
