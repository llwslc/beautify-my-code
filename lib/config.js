
module.exports = {
  a_format_on_save: {
    title: '文件保存时格式化代码',
    type: 'boolean',
    default: true
  },
  function_setting: {
    title: '功能',
    type: "object",
    order: 1,
    properties: {
      format_on_save: {
        title: '文件保存时格式化代码',
        type: 'boolean',
        default: true
      },
    },
  },
  tab_setting: {
    title: '缩进类型',
    type: "object",
    order: 2,
    properties: {
      indent_with_tabs: {
        title: '使用 tab 缩进代码',
        type: 'boolean',
        default: true
      },
      indent_size: {
        title: '代码缩进的长度为几个字母',
        type: 'integer',
        default: 2
      },
    },
  },
  style_setting: {
    title: '缩进风格',
    type: "object",
    order: 3,
    properties: {
      brace_style: {
        title: '大括号缩进风格',
        type: 'string',
        default: 'expand',
        enum: ['collapse', 'expand', 'end-expand', 'none']
      },
      preserve_inline: {
        title: '保留内联代码的缩进',
        type: 'boolean',
        default: true
      },
      object_brace_style_collapse: {
        title: 'object 大括号缩进风格为 collapse',
        type: 'boolean',
        default: true
      },
      keep_array_indentation: {
        title: '保留代码中 array 的缩进',
        type: 'boolean',
        default: false
      },
      z_break_chained_methods: {
        title: '链式函数另起一行',
        type: 'boolean',
        default: false
      },
    },
  },
  newline_setting: {
    title: '空行相关',
    type: "object",
    order: 4,
    properties: {
      newline_at_start: {
        title: '以空行为文件开头',
        type: 'boolean',
        default: true
      },
      newline_at_end: {
        title: '以空行为文件结尾',
        type: 'boolean',
        default: true
      },
      max_preserve_newlines: {
        title: '保留最多的空白行数',
        type: 'integer',
        default: 2
      },
    },
  },
  other_setting: {
    title: '其他',
    type: "object",
    order: 5,
    properties: {
      space_after_anon_function: {
        title: '匿名函数和括号之间加一个空格',
        type: 'boolean',
        default: true
      },
    },
  },
}
