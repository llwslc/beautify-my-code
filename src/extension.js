
var vscode = require('vscode');
var jsBeautify = require('mJsBeautify');

exports.activate = function (context)
{
    vscode.workspace.onDidSaveTextDocument(function (document)
    {
    console.log(document.getText().length);
vscode.window.showInformationMessage(document.getText().length);
    });
};

exports.deactivate = function ()
{};