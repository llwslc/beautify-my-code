
const jsBeautify = require(`js-beautify`).js_beautify;

var preserverStr = `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK(OL)P_{+}`;
var textArr = [];


var getTextArr = function (beautifiedText)
{
  textArr = [];
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
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          var oneLineCommentStr = beautifiedText.substring(i + 2, j + 1).replace(/^ +/g, ``);
          if (oneLineCommentStr === `\n`)
          {
            textArr.push({str: `//\n`, preserve: false});
          }
          else
          {
            textArr.push({str: `// `, preserve: false});
            textArr.push({str: oneLineCommentStr.replace(/\n$/g, ``), preserve: true});
            textArr.push({str: `\n`, preserve: false});
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
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
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
            textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
            textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
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
          textArr.push({str: beautifiedText.substring(startIndex, i), preserve: false});
          textArr.push({str: beautifiedText.substring(i, j + 1), preserve: true});
          i = j;
          startIndex = lastIndex = j + 1;
          break;
        }
      }
      continue;
    }
  }
  textArr.push({str: beautifiedText.substring(lastIndex, beautifiedText.length), preserve: false});
};

var getTempStr = function ()
{
  var tempStr = ``;

  for (var i = 0, iLen = textArr.length; i < iLen; ++i)
  {
    if (textArr[i].str.indexOf(preserverStr) !== -1)
    {
      i = 0;
      preserverStr += `#`;
    }
  }

  for (var i = 0, iLen = textArr.length; i < iLen; ++i)
  {
    if (textArr[i].preserve)
    {
      tempStr += preserverStr;
    }
    else
    {
      tempStr += textArr[i].str;
    }
  }

  return tempStr;
};

var backToSrcStr = function (tempStr)
{
  for (var i = 0, iLen = textArr.length; i < iLen; ++i)
  {
    if (textArr[i].preserve)
    {
      textArr[i].str = textArr[i].str.replace(/\$/g, '$$$$');
      tempStr = tempStr.replace(preserverStr, textArr[i].str);
    }
  }

  return tempStr;
};

var format = function (editorText, cfg, languageId)
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
  jsBeautifyOpts[`indent_size`] = cfg.tab_setting.indent_size;
  jsBeautifyOpts[`indent_with_tabs`] = cfg.tab_setting.indent_with_tabs;
  jsBeautifyOpts[`end_with_newline`] = cfg.newline_setting.newline_at_end;
  jsBeautifyOpts[`max_preserve_newlines`] = cfg.newline_setting.max_preserve_newlines;
  jsBeautifyOpts[`space_after_anon_function`] = cfg.other_setting.space_after_anon_function;
  brace_style = cfg.style_setting.brace_style;
  if (cfg.style_setting.preserve_inline)
  {
    brace_style += `,preserve-inline`;
  }
  jsBeautifyOpts[`brace_style`] = brace_style;
  jsBeautifyOpts[`break_chained_methods`] = cfg.style_setting.break_chained_methods;
  jsBeautifyOpts[`keep_array_indentation`] = cfg.style_setting.keep_array_indentation;

  var beautifiedText = jsBeautify(editorText, jsBeautifyOpts);

  beautifiedText = beautifiedText.replace(/\n+( *)}/g, `\n$1}`);

  if (cfg.newline_setting.newline_at_start && languageId == `javascript`)
  {
    if (beautifiedText.indexOf(`#!`))
    {
      beautifiedText = `\n${beautifiedText}`;
    }
  }

  getTextArr(beautifiedText);

  if (cfg.style_setting.object_brace_style_collapse)
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

  if (cfg.style_setting.space_in_brace)
  {
    beautifiedText = ``;
    for (var i = 0, iLen = textArr.length; i < iLen; ++i)
    {
      beautifiedText += textArr[i].str;
    }
  }
  else
  {
    var beautifiedTextSpaceInBraceTemp = getTempStr();

    var braceRegexp = /{ (.+?) }/g;
    while (beautifiedTextSpaceInBraceTemp.search(braceRegexp) !== -1)
    {
      beautifiedTextSpaceInBraceTemp = beautifiedTextSpaceInBraceTemp.replace(braceRegexp, `{$1}`);
    }

    beautifiedText = backToSrcStr(beautifiedTextSpaceInBraceTemp);
  }

  if (cfg.other_setting.code_comment_align)
  {
    getTextArr(beautifiedText);
    var beautifiedTextCodeCommentAlignTemp = getTempStr();

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
            subTextLineCodeLengthArr.push(subCode.length);
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
    beautifiedText = backToSrcStr(beautifiedTextCodeCommentAlignTemp);
  }

  return beautifiedText;
};


module.exports = (...args) => format(...args);
