
module.exports = {

  config: require('./config'),

  onSaveConfigObserve: null,
  onSaveFormatObserve: [],

  activate: function (state)
  {
    var self = this;
    atom.commands.add("atom-workspace", "beautify-my-code-atom:format", () => self.format());

    var configSaveStr = 'beautify-my-code-atom.function_setting.format_on_save';
    self.onSaveConfigObserve = atom.config.observe(configSaveStr, function ()
    {
      if (atom.config.get(configSaveStr))
      {
        self.onSaveFormatObserve.push(atom.workspace.observeTextEditors(function (editor)
        {
          self.onTextEdit(editor);
        }));
      }
      else
      {
        self.disposeSaveFormatObserve();
      }
    });
  },

  deactivate: function ()
  {
    this.onSaveConfigObserve.dispose();
    this.disposeSaveFormatObserve();
  },

  disposeSaveFormatObserve: function ()
  {
    for (var i = 0, iLen = this.onSaveFormatObserve.length; i < iLen; i++)
    {
      this.onSaveFormatObserve[i].dispose();
    }
  },

  isJsCode: function (editor)
  {
    var isJsCodeFlag = false;
    var grammar = editor.getGrammar().scopeName;
    if ((grammar == "source.js") || (grammar == "source.json"))
    {
      isJsCodeFlag = true;
    }

    return isJsCodeFlag;
  },

  onTextEdit: function (editor)
  {
    var self = this;
    if (self.isJsCode(editor))
    {
      self.onSaveFormatObserve.push(editor.buffer.onWillSave(function ()
      {
        self.format();
      }));
    }
  },

  format: function ()
  {
    var self = this;
    if (self.isJsCode(atom.workspace.getActiveTextEditor()))
    {
      console.log('foramt');
    }
  },
}
