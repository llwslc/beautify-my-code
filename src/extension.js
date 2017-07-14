
var vscode = require('vscode');
var mJsBeautify = require('./mJsBeautify');


exports.activate = function (context)
{
    var myConfig = {};
    var getCfg = function ()
    {
        myConfig = vscode.workspace.getConfiguration('beautify-my-code');
    }

    vscode.workspace.onWillSaveTextDocument(function (event)
    {
        var doc = event.document;
        if (doc.languageId !== 'javascript' && doc.languageId !== 'json')
        {
            return;
        }

        var editorText = doc.getText();
        var newText = mJsBeautify(editorText, myConfig);

        var fullRange = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
        var we = new vscode.WorkspaceEdit();

        we.replace(doc.uri, fullRange, newText);
        vscode.workspace.applyEdit(we);
    });

    vscode.workspace.onDidChangeConfiguration(function ()
    {
        getCfg();
    });

    getCfg();
};

exports.deactivate = function () { };