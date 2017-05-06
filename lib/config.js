
module.exports = {
  format_on_save: {
    description: '文件保存时格式化代码',
    type: 'boolean',
    default: true
  },
  indent_with_tabs: {
    description: '使用 tab 缩进代码',
    type: 'boolean',
    default: true
  },
  indent_size: {
    description: '代码缩进的长度为几个字母',
    type: 'integer',
    default: 2
  },
  start_with_newline: {
    description: '以空行为文件开头',
    type: 'boolean',
    default: true
  },
  end_with_newline: {
    description: '以空行为文件结尾',
    type: 'boolean',
    default: true
  },
  max_preserve_newlines: {
    description: '保留最多的空白行数',
    type: 'integer',
    default: 2
  },
  space_after_anon_function: {
    description: '匿名函数和括号之间加一个空格',
    type: 'boolean',
    default: true
  },
  brace_style: {
    description: '代码缩进风格',
    type: 'string',
    default: 'expand',
    enum: ['collapse', 'expand', 'end-expand', 'none']
  },
  preserve_inline: {
    description: '保留内联代码块的缩进',
    type: 'boolean',
    default: true
  },
  break_chained_methods: {
    description: '链式函数另起一行',
    type: 'boolean',
    default: false
  },
  keep_array_indentation: {
    description: '保留代码中 array 的缩进',
    type: 'boolean',
    default: false
  },
  object_style_collapse: {
    description: 'object 代码缩进风格为 collapse',
    type: 'boolean',
    default: false
  },
}


// Beautifier Options:
//   _s, --indent-size                 Indentation size [4]
//   -c, --indent-char                 Indentation character [" "]
//   -t, --indent-with-tabs            Indent with tabs, overrides -s and -c
//   -e, --eol                         Character(s) to use as line terminators.
//                                     [first newline in file, otherwise "\n]
//   -n, --end-with-newline            End output with newline
//   --editorconfig                    Use EditorConfig to set up the options
//   -l, --indent-level                Initial indentation level [0]
//   -p, --preserve-newlines           Preserve line-breaks (--no-preserve-newlines disables)
//   -m, --max-preserve-newlines       Number of line-breaks to be preserved in one chunk [10]
//   -P, --space-in-paren              Add padding spaces within paren, ie. f( a, b )
//   -E, --space-in-empty-paren        Add a single space inside empty paren, ie. f( )
//   -j, --jslint-happy                Enable jslint-stricter mode
//   -a, --space-after-anon-function   Add a space before an anonymous function's parens, ie. function ()
//   -b, --brace-style                 [collapse|expand|end-expand|none][,preserve-inline] [collapse,preserve-inline]
//   -B, --break-chained-methods       Break chained method calls across subsequent lines
//   -k, --keep-array-indentation      Preserve array indentation
//   -x, --unescape-strings            Decode printable characters encoded in xNN notation
//   -w, --wrap-line-length            Wrap lines at next opportunity after N characters [0]
//   -X, --e4x                         Pass E4X xml literals through untouched
//   --good-stuff                      Warm the cockles of Crockford's heart
//   -C, --comma-first                 Put commas at the beginning of new line instead of end
//   -O, --operator-position           Set operator position (before-newline|after-newline|preserve-newline) [before-newline]

