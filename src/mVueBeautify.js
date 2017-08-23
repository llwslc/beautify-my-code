
var common = require('./common');
var vueCompiler = require('vue-template-compiler');
var mHtmlBeautify = require('./mHtmlBeautify');
var mJsBeautify = require('./mJsBeautify');
var mCssBeautify = require('./mCssBeautify');

var getJsCode = function (editorText)
{
  return vueCompiler.parseComponent(editorText, {pad: 'space'}).script.content;
};

var format = function (editorText, cfg)
{
  var beautifiedText = '';
  var parts = vueCompiler.parseComponent(editorText, {pad: 'space'});

  if (!parts.template)
  {
    parts.template = {};
    parts.template.content = '\n';
  }
  if (!parts.script)
  {
    parts.script = {};
    parts.script.content = '';
  }

  var html = mHtmlBeautify(`<template>${parts.template.content}</template>`, cfg);
  var js = mJsBeautify(parts.script.content.replace(/^ +$/mg, '  '), cfg, common.jsLanguageId);
  var css = [];
  parts.styles.forEach(function (style)
  {
    css.push(mCssBeautify(style.content.replace(/^ +$/mg, '  '), cfg));
  });

  beautifiedText = `${html}\n`;
  beautifiedText += `<script>\n`;
  js = js.replace(/\n$/, '');
  beautifiedText += js;
  if (js.length)
  {
    beautifiedText += `\n`;
  }
  beautifiedText += `</script>\n`;
  parts.styles.forEach(function (style, index)
  {
    beautifiedText += `\n<style `;
    if (style.scoped)
    {
      beautifiedText += `scoped `;
    }
    if (style.lang)
    {
      beautifiedText += `lang="${style.lang}">\n`;
    }
    else
    {
      beautifiedText += `lang="css">\n`;
    }

    beautifiedText += css[index];
    beautifiedText += `</style>\n`;
  });


  return beautifiedText;
};


module.exports = (...args) => format(...args);
module.exports.getJsCode = getJsCode;
