
var common = require('./common');
var cssBeautify = require(`js-beautify`).css;

var format = function (editorText, cfg)
{
  var cssBeautifyOpts = {
    'indent_char': ' ',
    'eol': '\n',
    'selector_separator_newline': true,
    'newline_between_rules': true,
  };
  cssBeautifyOpts[`indent_size`] = cfg.tab_setting.indent_size;
  cssBeautifyOpts[`indent_with_tabs`] = cfg.tab_setting.indent_with_tabs;
  cssBeautifyOpts[`end_with_newline`] = cfg.newline_setting.newline_at_end;

  var beautifiedText = cssBeautify(editorText, cssBeautifyOpts);


  return beautifiedText;
};


module.exports = (...args) => format(...args);
