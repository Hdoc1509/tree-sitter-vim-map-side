/**
 * @file Vim's map side (lhs and rhs) grammar for tree-sitter
 * @author Héctor Ochoa <hector.ochoa.dev@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vim_map_side",

  extras: ($) => [$.comment, $._blank],

  rules: {
    map_side: ($) =>
      choice(
        $.expression,
        seq($._not_keycode, choice($._range_s_command, $._vimgrep)),
        repeat1(
          choice(
            $.keycode,
            $._cmd_rhs,
            $._colon_rhs,
            $._not_keycode,
            $._lua_cur_line
          )
        )
      ),

    keycode: () => seq("<", /[^>\r\n]+/, ">"),
    _not_keycode: () => /[^<:("\r\n]+/,

    _range_s_command: ($) =>
      seq(alias(":%", $.command), alias(/s[^\r\n]+/, $.command)),

    _vimgrep: ($) => alias(/:vimgrep[^\r\n]+/, $.command),

    _lua_cur_line: ($) =>
      seq(alias(":.", $.command), alias("lua", $.command), $._cr),

    _cmd_rhs: ($) =>
      seq(
        alias(/<[Cc][Mm][Dd]>/, $.keycode),
        $.command,
        repeat(seq($._pipe, $.command)),
        $._cr
      ),

    _colon_rhs: ($) =>
      seq(
        choice(
          seq(":", alias(/<[Cc]-[Uu]>/, $.keycode), $.command),
          alias($._first_command, $.command)
        ),
        repeat(seq($._pipe, $.command)),
        $._cr
      ),
    _first_command: ($) => seq(":", optional($._range), /[^<|\\]+/),
    _range: () => "'<,'>",

    command: () => /[^<|\\]+/,
    _cr: ($) => alias(/<[Cc][Rr]>/, $.keycode),

    _pipe: ($) => choice("\\|", "|", alias(/<[Bb][Aa][Rr]>/, $.bar)),

    expression: ($) => $.printf,

    printf: ($) =>
      seq(
        "printf",
        "(",
        optional(seq($.string, repeat(seq(",", $._argument)))),
        ")"
      ),
    string: ($) => seq("'", optional($.string_content), "'"),
    string_content: () => /[^']+/,
    _argument: ($) => choice($.scoped_identifier),

    scoped_identifier: ($) => seq($.scope, $.identifier),
    // NOTE: more scopes `:help variable-scope`
    scope: () => /[glv]:/,
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]+/,

    // NOTE: just for highlighting tests
    comment: () => /"[^\r\n]*/,

    _blank: () => /\s+/,
  },
});
