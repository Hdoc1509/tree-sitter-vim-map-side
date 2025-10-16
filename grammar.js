/**
 * @file Vim's map side (lhs and rhs) grammar for tree-sitter
 * @author Héctor Ochoa <hector.ochoa.dev@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vim_map_side",

  rules: {
    map_side: ($) => repeat1(choice($.keycode, $._not_keycode)),

    keycode: () => seq("<", /[^>]+/, ">"),
    _not_keycode: () => /[^<]+/,
  },
});
