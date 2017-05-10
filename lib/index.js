
const jsBeautify = require(`js-beautify`).js_beautify;

module.exports = {

  packageName: `beautify-my-code-atom`,

  config: require(`./config`),

  configSaveStr: '',

  onSaveConfigObserve: null,
  onSaveFormatObserve: [],

  activate: function (state)
  {
    var self = this;
    atom.commands.add(`atom-workspace`, `${self.packageName}:format_on_save`, () => self.formatOnSave(true));

    self.configSaveStr = `${self.packageName}.function_setting.format_on_save`;
    self.onSaveConfigObserve = atom.config.observe(self.configSaveStr, () =>
    {
      self.formatOnSave(false);
      if (atom.config.get(self.configSaveStr))
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
    for (var i = 0, iLen = this.onSaveFormatObserve.length; i < iLen; ++i)
    {
      this.onSaveFormatObserve[i].dispose();
    }
  },

  formatOnSave: function (setFlag)
  {
    var self = this;
    var selfPkgMenu = {};
    atom.menu.template.forEach(function (tmp)
    {
      if (tmp.label == `&Packages`)
      {
        tmp.submenu.forEach(function (pkg)
        {
          if (pkg.label == `Beautify My Code`)
          {
            selfPkgMenu = pkg;
          }
        });
      }
    });

    if (atom.config.get(this.configSaveStr))
    {
      setFlag ? atom.config.set(this.configSaveStr, `false`) : null;
      selfPkgMenu.submenu[0].label = `${setFlag ? '' : '√ '}Format on save`;
    }
    else
    {
      setFlag ? atom.config.set(this.configSaveStr, `true`) : null;
      selfPkgMenu.submenu[0].label = `${setFlag ? '√ ' : ''}Format on save`;
    }

    atom.menu.update();
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
      var jsBeautifyOpts = {
        'indent_char': ' ',
        'eol': '\n',
        'preserve_newlines': true,
        'space_in_paren': false,
        'space_in_empty_paren': false,
        'jslint_happy': false,
        'unescape_strings': false,
        'wrap_line_length': 0,
        'e4x': false,
        'comma_first': false,
        'operator_position': 'before-newline',
      };
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

      beautifiedText = beautifiedText.replace(/\n+( *)}/g, `\n$1}`);

      if (atom.config.get(`${self.packageName}.newline_setting.newline_at_start`))
      {
        beautifiedText = `\n${beautifiedText}`;
      }

      var textArr = [];
      var startIndex = 0;
      var lastIndex = 0;
      for (var i = 0, iLen = beautifiedText.length; i < iLen; ++i)
      {
        // one line comment
        if (beautifiedText[i] == `/` && beautifiedText[i + 1] == `/`)
        {
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          for (var j = i + 2, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `\n`)
            {
              textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
          continue;
        }
        // multi-line comment
        if (beautifiedText[i] == `/` && beautifiedText[i + 1] == `*`)
        {
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          for (var j = i + 2, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `*` && beautifiedText[j + 1] == `/`)
            {
              j++;
              textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
          continue;
        }
        // string
        if (beautifiedText[i] == `"` && beautifiedText[i - 1] !== `\\`)
        {
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `"` && beautifiedText[j - 1] !== `\\`)
            {
              textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
          continue;
        }
        // string
        if (beautifiedText[i] == `'` && beautifiedText[i - 1] !== `\\`)
        {
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `'` && beautifiedText[j - 1] !== `\\`)
            {
              textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
          continue;
        }
        // template literals
        if (beautifiedText[i] == `\`` && beautifiedText[i - 1] !== `\\`)
        {
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `\`` && beautifiedText[j - 1] !== `\\`)
            {
              textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
          continue;
        }
        // regexp
        if (beautifiedText[i] == `/`)
        {
          for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
          {
            if (beautifiedText[j] == `/` && beautifiedText[j - 1] !== `\\`)
            {
              var regexpStr = beautifiedText.substring(i, j + 1);
              try
              {
                eval(regexpStr);
                textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
                textArr.push({str: regexpStr, preserve: true});
                i = j;
                startIndex = lastIndex = j + 1;
                break;
              }
              catch (e)
              {
                // null
              }
            }
          }
          continue;
        }
      }
      textArr.push({str: beautifiedText.substring(lastIndex, beautifiedText.length), preserve: false});

      if (atom.config.get(`${self.packageName}.style_setting.object_brace_style_collapse`))
      {
        for (var i = 0, iLen = textArr.length; i < iLen; ++i)
        {
          if (!textArr[i].preserve)
          {
            textArr[i].str = textArr[i].str.replace(/\(\n *{/g, `({`);
            textArr[i].str = textArr[i].str.replace(/:\n *{/g, `: {`);
          }
        }
      }

      if (atom.config.get(`${self.packageName}.style_setting.space_in_brace`))
      {
        beautifiedText = ``;
        for (var i = 0, iLen = textArr.length; i < iLen; ++i)
        {
          beautifiedText += textArr[i].str;
        }
      }
      else
      {
        var beautifiedTextSpaceInBraceTemp = ``;
        var preserverStr = `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK(OL)P_{+}`;

        for (var i = 0, iLen = textArr.length; i < iLen; ++i)
        {
          if (textArr[i].preserve)
          {
            beautifiedTextSpaceInBraceTemp += preserverStr;
          }
          else
          {
            beautifiedTextSpaceInBraceTemp += textArr[i].str;
          }
        }
        beautifiedTextSpaceInBraceTemp = beautifiedTextSpaceInBraceTemp.replace(/{ (.+) }/g, `{$1}`);

        for (var i = 0, iLen = textArr.length; i < iLen; ++i)
        {
          if (textArr[i].preserve)
          {
            beautifiedTextSpaceInBraceTemp = beautifiedTextSpaceInBraceTemp.replace(preserverStr, textArr[i].str);
          }
        }

        beautifiedText = beautifiedTextSpaceInBraceTemp;
      }

      if (atom.config.get(`${self.packageName}.other_setting.code_comment_align`))
      {
        var spaceAddNum = 2;
        var textLines = beautifiedText.split(`\n`);
        for (var i = 0, iLen = textLines.length; i < iLen; ++i)
        {
          if ((textLines[i].indexOf(`//`) !== -1) && (textLines[i].indexOf(`//`) !== 0))
          {
            var startCommentLine = i;
            var endCommentLine = i;
            for (var j = i + 1, jLen = textLines.length; j < jLen; ++j)
            {
              if (textLines[j].indexOf(`//`) === -1)
              {
                i = endCommentLine = j;
                break;
              }
            }

            if ((endCommentLine - startCommentLine) > 1)
            {
              var subTextLines = [];
              var subTextLineCodeLengthArr = [];
              var maxCodeLength = 0;
              for (var j = startCommentLine, jLen = endCommentLine; j < jLen; ++j)
              {
                var subTextLineArr = textLines[j].split(`//`);
                subTextLines.push({code: subTextLineArr[0].trimRight(), comment: subTextLineArr[1].trim()});
                subTextLineCodeLengthArr.push(subTextLineArr[0].trimRight().length)
              }

              maxCodeLength = Math.max.apply(null, subTextLineCodeLengthArr);
              var subTextLinesIndex = 0;
              for (var j = startCommentLine, jLen = endCommentLine; j < jLen; ++j)
              {
                var spaceStr = (new Array(maxCodeLength + spaceAddNum - subTextLines[subTextLinesIndex].code.length + 1)).join(` `);
                textLines[j] = `${subTextLines[subTextLinesIndex].code}${spaceStr}//${subTextLines[subTextLinesIndex].comment}`;
                subTextLinesIndex++;
              }
            }
          }
        }

        beautifiedText = textLines.join(`\n`)
      }

      if (editorText !== beautifiedText)
      {
        editor.setText(beautifiedText);
      }
    }
  },
}
