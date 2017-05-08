
const jsBeautify = require(`js-beautify`).js_beautify;

module.exports = {

  packageName: `beautify-my-code-atom`,

  config: require(`./config`),

  onSaveConfigObserve: null,
  onSaveFormatObserve: [],

  activate: function (state)
  {
    var self = this;
    atom.commands.add(`atom-workspace`, `${self.packageName}:format`, () => self.format());

    var configSaveStr = `${self.packageName}.function_setting.format_on_save`;
    self.onSaveConfigObserve = atom.config.observe(configSaveStr, () =>
    {
      if (atom.config.get(configSaveStr))
      {
        self.onSaveFormatObserve.push(atom.workspace.observeTextEditors((editor) =>
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
    if ((grammar == `source.js`) || (grammar == `source.json`))
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
      self.onSaveFormatObserve.push(editor.buffer.onWillSave(() => self.format()));
    }
  },

  format: function ()
  {
    var self = this;
    var editor = atom.workspace.getActiveTextEditor();
    if (self.isJsCode(editor))
    {
      var jsBeautifyOpts = {};
      var brace_style = ``;
      jsBeautifyOpts[`indent_size`] = atom.config.get(`${self.packageName}.tab_setting.indent_size`);
      jsBeautifyOpts[`indent_with_tabs`] = atom.config.get(`${self.packageName}.tab_setting.indent_with_tabs`);
      jsBeautifyOpts[`end_with_newline`] = atom.config.get(`${self.packageName}.newline_setting.newline_at_end`);
      jsBeautifyOpts[`max_preserve_newlines`] = atom.config.get(`${self.packageName}.newline_setting.max_preserve_newlines`);
      jsBeautifyOpts[`space_after_anon_function`] = atom.config.get(`${self.packageName}.other_setting.space_after_anon_function`);
      brace_style = atom.config.get(`${self.packageName}.style_setting.brace_style`);
      if (atom.config.get(`${self.packageName}.style_setting.preserve_inline`))
      {
        brace_style += `,preserve-inline`;
      }
      jsBeautifyOpts[`brace_style`] = brace_style;
      jsBeautifyOpts[`break_chained_methods`] = atom.config.get(`${self.packageName}.style_setting.z_break_chained_methods`);
      jsBeautifyOpts[`keep_array_indentation`] = atom.config.get(`${self.packageName}.style_setting.keep_array_indentation`);

      var editorText = editor.getText();
      var beautifiedText = jsBeautify(editorText, jsBeautifyOpts);

      if (atom.config.get(`${self.packageName}.newline_setting.newline_at_start`))
      {
        //
      }

      if (atom.config.get(`${self.packageName}.style_setting.object_brace_style_collapse`))
      {
        //
      }

      if (editorText !== beautifiedText)
      {
        editor.setText(beautifiedText);
      }
    }
  },
}
