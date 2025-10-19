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
      repeat1(
        choice(
          $.keycode,
          $.expression,
          $._cmd_rhs,
          $._colon_rhs,
          $._not_keycode
        )
      ),

    keycode: () => seq("<", /[^>\r\n]+/, ">"),
    _not_keycode: () => /[^<:("\r\n]+/,

    _cmd_rhs: ($) =>
      seq(
        "<",
        alias(choice("cmd", "Cmd", "CMD"), $.keycode),
        ">",
        repeat1(choice($.command, $._pipe)),
        $.keycode
      ),

    _colon_rhs: ($) =>
      seq(
        alias($._first_command, $.command),
        repeat(choice($.command, $._pipe)),
        $.keycode
      ),
    _first_command: ($) => seq(":", optional($._range), /[^<|\\]+/),
    _range: () => "'<,'>",

    command: () => /[^<|\\]+/,

    _pipe: () => "\\|",

    expression: ($) => $.printf,

    printf: ($) =>
      seq(
        "printf",
        "(",
        // NOTE: `optional` to allow highlighting while writing code
        optional(seq($.string, repeat(seq(",", $._argument)))),
        ")"
      ),
    string: ($) => seq("'", $.string_content, "'"),
    string_content: () => /[^']+/,
    _argument: ($) => choice($.scoped_identifier),

    scoped_identifier: ($) => seq($.scope, $.identifier),
    scope: () => /[glv]:/,
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]+/,

    // NOTE: just for highlighting tests
    comment: () => /".+/,

    _blank: () => /\s+/,
  },
});
