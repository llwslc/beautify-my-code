
var common = require('./common');
var htmlBeautify = require(`js-beautify`).html;

var format = function (editorText, cfg)
{
  var htmlBeautifyOpts = {
    'indent_char': ' ',
    'eol': '\n',
    'preserve_newlines': true,
    'indent_inner_html': false,
    'indent_scripts': 'normal',
    'wrap_line_length': 0,
    'wrap_attributes ': 'auto',
    'unformatted': ['inline'],
    'content_unformatted': ['pre'],
    'extra_liners': ['head', 'body', '/html']
  };
  var brace_style = ``;
  htmlBeautifyOpts[`indent_size`] = cfg.tab_setting.indent_size;
  htmlBeautifyOpts[`indent_with_tabs`] = cfg.tab_setting.indent_with_tabs;
  htmlBeautifyOpts[`end_with_newline`] = cfg.newline_setting.newline_at_end;
  htmlBeautifyOpts[`max_preserve_newlines`] = cfg.newline_setting.max_preserve_newlines;
  brace_style = cfg.style_setting.brace_style;
  if (cfg.style_setting.preserve_inline)
  {
    brace_style += `,preserve-inline`;
  }
  htmlBeautifyOpts[`brace_style`] = brace_style;
  htmlBeautifyOpts[`wrap_attributes_indent_size`] = cfg.tab_setting.indent_size;

  var beautifiedText = htmlBeautify(editorText, htmlBeautifyOpts);


  return beautifiedText;
};


module.exports = (...args) => format(...args);
