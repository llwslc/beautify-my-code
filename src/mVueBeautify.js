
var common = require('./common');
var vueCompiler = require('vue-template-compiler');
var mHtmlBeautify = require('./mHtmlBeautify');
var mJsBeautify = require('./mJsBeautify');
var mCssBeautify = require('./mCssBeautify');

var format = function (editorText, cfg)
{
  var beautifiedText = '';
  var parts = vueCompiler.parseComponent(editorText, {pad: 'space'});

  var html = mHtmlBeautify(`<template>${parts.template.content}</template>`, cfg);
  var js = mJsBeautify(parts.script.content.replace(/^ +$/mg, '  '), cfg, common.jsLanguageId);
  var css = [];
  parts.styles.forEach(function (style)
  {
    css.push(mCssBeautify(style.content.replace(/^ +$/mg, '  '), cfg));
  });

  beautifiedText = `${html}\n`;
  beautifiedText += `<script>\n`;
  beautifiedText += js;
  beautifiedText += `\n</script>\n`;
  parts.styles.forEach(function (style, index)
  {
    beautifiedText += `\n<style lang="${style.lang}">\n`;
    beautifiedText += css[index];
    beautifiedText += `\n</style>\n`;
  });


  return beautifiedText;
};


module.exports = (...args) => format(...args);
