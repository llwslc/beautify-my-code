
const jsBeautify = require(`js-beautify`).js_beautify;

module.exports = {

  packageName: `beautify-my-code-atom`,

  config: require(`./config`),

  configSaveStr: '',

  onSaveConfigObserve: null,
  onSaveFormatObserve: [],

  preserverStr: `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK(OL)P_{+}`,

  textArr: [],

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

    var templateLabel = `&Packages`;
    if (process.platform == `win32`)
    {
      templateLabel = `&Packages`;
    }
    else if (process.platform == `darwin`)
    {
      templateLabel = `Packages`;
    }
    atom.menu.template.forEach(function (tmp)
    {
      if (tmp.label === templateLabel)
      {
        tmp.submenu.forEach(function (pkg)
        {
          if (pkg.label === `Beautify My Code`)
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
    if ((grammar === `source.js`) || (grammar === `source.json`))
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

  getTextArr: function (beautifiedText)
  {
    var self = this;
    self.textArr = [];
    var startIndex = 0;
    var lastIndex = 0;

    for (var i = 0, iLen = beautifiedText.length; i < iLen; ++i)
    {
      // one line comment
      if (beautifiedText[i] === `/` && beautifiedText[i + 1] === `/`)
      {
        for (var j = i + 2, jLen = beautifiedText.length; j < jLen; ++j)
        {
          if (beautifiedText[j] === `\n`)
          {
            self.textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
            var oneLineCommentStr = beautifiedText.substring(i + 2, j + 1).replace(/^ +/g, ``);
            if (oneLineCommentStr === `\n`)
            {
              self.textArr.push({str: `//\n`, preserve: false});
            }
            else
            {
              self.textArr.push({str: `// `, preserve: false});
              self.textArr.push({str: oneLineCommentStr.replace(/\n$/g, ``), preserve: true});
              self.textArr.push({str: `\n`, preserve: false});
            }
            i = j;
            startIndex = lastIndex = j + 1;
            break;
          }
        }
        continue;
      }
      // multi-line comment
      if (beautifiedText[i] === `/` && beautifiedText[i + 1] === `*`)
      {
        for (var j = i + 2, jLen = beautifiedText.length; j < jLen; ++j)
        {
          if (beautifiedText[j] === `/` && beautifiedText[j - 1] === `*`)
          {
            self.textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
            self.textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
            i = j;
            startIndex = lastIndex = j + 1;
            break;
          }
        }
        continue;
      }
      // string & template literals
      if (beautifiedText[i] === `"` || beautifiedText[i] === `'` || beautifiedText[i] === `\``)
      {
        var delimiter = beautifiedText[i];
        for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
        {
          if (beautifiedText[j] === `\n` && delimiter !== `\``)
          {
            break;
          }
          if (beautifiedText[j] === delimiter)
          {
            var findDelimiter = false;
            if (beautifiedText[j - 1] === `\\`)
            {
              if (beautifiedText[j - 2] === `\\`)
              {
                // 'abc\\' is ok
                findDelimiter = true;
              }
            }
            else
            {
              findDelimiter = true;
            }
            if (findDelimiter)
            {
              self.textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
              self.textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
              i = j;
              startIndex = lastIndex = j + 1;
              break;
            }
          }
        }
        continue;
      }
      // regexp
      if (beautifiedText[i] === `/`)
      {
        var in_char_class = false;
        for (var j = i + 1, jLen = beautifiedText.length; j < jLen; ++j)
        {
          if (beautifiedText[j - 1] === `\\`)
          {
            continue;
          }
          if (beautifiedText[j] === `\n`)
          {
            break;
          }
          if (beautifiedText[j] === `[`)
          {
            in_char_class = true;
          }
          if (beautifiedText[j] === `]`)
          {
            in_char_class = false;
          }
          if (beautifiedText[j] === `/` && in_char_class === false)
          {
            self.textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
            self.textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
            i = j;
            startIndex = lastIndex = j + 1;
            break;
          }
        }
        continue;
      }
    }
    self.textArr.push({str: beautifiedText.substring(lastIndex, beautifiedText.length), preserve: false});
  },

  getTempStr: function ()
  {
    var self = this;
    var tempStr = ``;

    for (var i = 0, iLen = self.textArr.length; i < iLen; ++i)
    {
      if (self.textArr[i].str.indexOf(self.preserverStr) !== -1)
      {
        i = 0;
        self.preserverStr += `#`;
      }
    }

    for (var i = 0, iLen = self.textArr.length; i < iLen; ++i)
    {
      if (self.textArr[i].preserve)
      {
        tempStr += self.preserverStr;
      }
      else
      {
        tempStr += self.textArr[i].str;
      }
    }

    return tempStr;
  },

  backToSrcStr: function (tempStr)
  {
    var self = this;

    for (var i = 0, iLen = self.textArr.length; i < iLen; ++i)
    {
      if (self.textArr[i].preserve)
      {
        tempStr = tempStr.replace(self.preserverStr, self.textArr[i].str);
      }
    }

    return tempStr;
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

      self.getTextArr(beautifiedText);

      if (atom.config.get(`${self.packageName}.style_setting.object_brace_style_collapse`))
      {
        for (var i = 0, iLen = self.textArr.length; i < iLen; ++i)
        {
          if (!self.textArr[i].preserve)
          {
            self.textArr[i].str = self.textArr[i].str.replace(/\(\n *{/g, `({`);
            self.textArr[i].str = self.textArr[i].str.replace(/:\n *{/g, `: {`);
          }
        }
      }

      if (atom.config.get(`${self.packageName}.style_setting.space_in_brace`))
      {
        beautifiedText = ``;
        for (var i = 0, iLen = self.textArr.length; i < iLen; ++i)
        {
          beautifiedText += self.textArr[i].str;
        }
      }
      else
      {
        var beautifiedTextSpaceInBraceTemp = self.getTempStr();

        var braceRegexp = /{ (.+?) }/g;
        while (beautifiedTextSpaceInBraceTemp.search(braceRegexp) !== -1)
        {
          beautifiedTextSpaceInBraceTemp = beautifiedTextSpaceInBraceTemp.replace(braceRegexp, `{$1}`);
        }

        beautifiedText = self.backToSrcStr(beautifiedTextSpaceInBraceTemp);
      }

      if (atom.config.get(`${self.packageName}.other_setting.code_comment_align`))
      {
        self.getTextArr(beautifiedText);
        var beautifiedTextCodeCommentAlignTemp = self.getTempStr();

        var spaceAddNum = 2;
        var textLines = beautifiedTextCodeCommentAlignTemp.split(`\n`);
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
                var subTextLineIndex = textLines[j].indexOf(`//`);
                var subCode = textLines[j].substring(0, subTextLineIndex).trimRight();
                subTextLines.push({code: subCode, comment: textLines[j].substring(subTextLineIndex + 2).trim()});
                subTextLineCodeLengthArr.push(subCode.length)
              }

              maxCodeLength = Math.max.apply(null, subTextLineCodeLengthArr);
              if (maxCodeLength !== 0)
              {
                var subTextLinesIndex = 0;
                for (var j = startCommentLine, jLen = endCommentLine; j < jLen; ++j)
                {
                  var spaceStr = (new Array(maxCodeLength + spaceAddNum - subTextLines[subTextLinesIndex].code.length + 1)).join(` `);
                  if (subTextLines[subTextLinesIndex].comment.length !== 0)
                  {
                    subTextLines[subTextLinesIndex].comment = ` ${subTextLines[subTextLinesIndex].comment}`;
                  }
                  textLines[j] = `${subTextLines[subTextLinesIndex].code}${spaceStr}//${subTextLines[subTextLinesIndex].comment}`;
                  subTextLinesIndex++;
                }
              }
            }
          }
        }

        beautifiedTextCodeCommentAlignTemp = textLines.join(`\n`);
        beautifiedText = self.backToSrcStr(beautifiedTextCodeCommentAlignTemp);
      }

      if (editorText !== beautifiedText)
      {
        editor.setText(beautifiedText);
      }
    }
  },
}
