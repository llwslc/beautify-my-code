
var vscode = require('vscode');

exports.activate = function (context)
{
    var textEditorObs = {};

    var initTextEditorObserve = function (editor)
    {
        var doc = editor.document;
        var language = doc.languageId;
        if (language == 'javascript' || language == 'json')
        {
            textEditorObs[doc.uri.fsPath] = editor;
        }
    }

    for (var i = 0, iLen = vscode.window.visibleTextEditors.length; i < iLen; ++i)
    {
        initTextEditorObserve(vscode.window.visibleTextEditors[i]);
    }

    vscode.workspace.onDidOpenTextDocument(function (document)
    {
        const active = vscode.window.activeTextEditor;
        if (!active && !acitve.document.isUntitled) return;

        initTextEditorObserve(active)
    });

    vscode.workspace.onWillSaveTextDocument(function (event)
    {
        var doc = event.document;
        var curText = doc.getText();
        console.log(doc.getText().length);

        var newText = curText + 'xxxx';

        var fullRange = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
        textEditorObs[doc.uri.fsPath].edit(function (editorEdit)
        {
            editorEdit.replace(fullRange, newText);
        });

        vscode.window.showInformationMessage(document.getText().length);
    });

};

exports.deactivate = function () { };
