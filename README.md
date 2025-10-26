# tree-sitter-vim-map-side

[![CI][ci]](https://github.com/Hdoc1509/tree-sitter-vim-map-side/actions/workflows/ci.yml)
[![discord][discord]](https://discord.gg/w7nTvsVJhm)
[![matrix][matrix]](https://matrix.to/#/#tree-sitter-chat:matrix.org)
[![crates][crates]](https://crates.io/crates/tree-sitter-vim-map-side)
[![npm][npm]](https://www.npmjs.com/package/tree-sitter-vim-map-side)
[![pypi][pypi]](https://pypi.org/project/tree-sitter-vim-map-side)

[Vim's map](https://vimhelp.org/map.txt.html#map.txt) side (`lhs` and `rhs`)
grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

Primaryly intended to be used within `lua`, but also supports `vim` mappings
with `rhs` that starts with `:` ([not supported at the moment][ts-vim-map-colon]).

> [!IMPORTANT]
> ABI version: `15`

## Supported `rhs` expressions

- `printf()`
- `variable-scope`: `g:`, `l:`, `v:`

> [!NOTE]
> More expressions will be supported in the future if requested.

## Parser requirements

- [`lua`][ts-lua]: injection to `lsh` and `rhs` of [keymap
  functions](#lua-parser) of neovim
- [`printf`][ts-printf] (optional): injection to first argument of `printf()`
  expression.
- [`vim`][ts-vim] (optional): injection to `rhs` when it starts with `:` and to
  `command` nodes of this grammar.

## Usage in Editors

### Neovim

- [vim-map-side.nvim](https://github.com/Hdoc1509/vim-map-side.nvim): plugin
  that integrates this grammar to your `Neovim` configuration.

### Helix

WIP

### Emacs

WIP

### In General

You can get the built files from the [`release` branch][release-branch]. If you
have specific instructions for your editor, PR's are welcome.

Each release has 2 tags:

1. `vX.X.X` for the `master` branch. It includes all repo's files
2. `deploy-vX.X.X` for the `release` branch. It only includes files needed for
   `tree-sitter`

> [!NOTE]
> `X.X.X` is a placeholder for the version of the grammar. Don't use it as a
> value

## Injections

> [!NOTE]
> If you are using Neovim, you can use `lua-match?` and `not-lua-match?`
> predicates instead of `match?` and `not-match?`.
> Be sure to use `%s` instead of `\s` and `%S` instead of `\S` in the regexes.

### `lua` parser

For `vim.keymap.set()`, `vim.api.nvim_set_keymap()` and
`vim.api.nvim_buf_set_keymap()` functions of `neovim`:

```query
; NOTE: for lhs and rhs
(function_call
  name: (_) @_fn
  arguments: [
    ; format-ignore
    (arguments
      . (_) ; -- mode --
      .
      (string
        (string_content) @injection.content))
    ; format-ignore
    (arguments
      . (_) ; -- mode --
      . (_) ; -- lhs --
      (string
        (string_content) @injection.content))
  ]
  (#any-of? @_fn "vim.keymap.set" "vim.api.nvim_set_keymap")
  (#match? @injection.content "<\S+>")
  (#set! injection.language "vim_map_side"))

(function_call
  name: (_) @_fn
  arguments: [
    ; format-ignore
    (arguments
      . (_) ; -- buffer --
      . (_) ; -- mode --
      .
      (string
        (string_content) @injeciton.content))
    ; format-ignore
    (arguments
      . (_) ; -- buffer --
      . (_) ; -- mode --
      . (_) ; -- lhs --
      .
      (string
        (string_content) @injeciton.content))
  ]
  (#eq? @_fn "vim.api.nvim_buf_set_keymap")
  (#match? @injeciton.content "<\S+>")
  (#set! injection.language "vim_map_side"))

; NOTE: for expressions as rhs
(function_call
  name: (_) @_fn
  ; format-ignore
  arguments: (arguments
    . (_) ; -- mode --
    . (_) ; -- lhs --
    .
    (string
      (string_content) @injection.content)
    .
    (table_constructor) @_options)
  (#any-of? @_fn "vim.keymap.set" "vim.api.nvim_set_keymap")
  ; NOTE: to avoid double injection
  (#not-match? @injection.content "<\S+>")
  (#match? @_options "expr\s*=\s*true")
  (#set! injection.language "vim_map_side"))

(function_call
  name: (_) @_fn
  ; format-ignore
  arguments: (arguments
    . (_) ; -- buffer --
    . (_) ; -- mode --
    . (_) ; -- lhs --
    .
    (string
      (string_content) @injection.content)
    .
    (table_constructor) @_options)
  (#eq? @_fn "vim.api.nvim_buf_set_keymap")
  ; NOTE: to avoid double injection
  (#not-match? @injection.content "<\S+>")
  (#match? @_options "expr\s*=\s*true")
  (#set! injection.language "vim_map_side"))
```

### `vim` parser

```query
(map_statement
  rhs: (map_side) @injection.content
  (#match? @injection.content "^:")
  (#set! injection.include-children)
  (#set! injection.language "vim_map_side"))
```

## References

- [tree-sitter-vim grammar][ts-vim]

[ci]: https://github.com/Hdoc1509/tree-sitter-vim-map-side/actions/workflows/ci.yml/badge.svg
[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix
[crates]: https://img.shields.io/crates/v/tree-sitter-vim-map-side?logo=rust
[npm]: https://img.shields.io/npm/v/tree-sitter-vim-map-side?logo=npm
[pypi]: https://img.shields.io/pypi/v/tree-sitter-vim-map-side?logo=pypi&logoColor=ffd242
[ts-vim-map-colon]: https://github.com/tree-sitter-grammars/tree-sitter-vim/blob/3dd4747082d1b717b8978211c06ef7b6cd16125b/test/corpus/map.txt#L278-L281
[ts-lua]: https://github.com/tree-sitter-grammars/tree-sitter-lua
[ts-printf]: https://github.com/tree-sitter-grammars/tree-sitter-printf
[ts-vim]: https://github.com/tree-sitter-grammars/tree-sitter-vim
[release-branch]: https://github.com/Hdoc1509/tree-sitter-vim-map-side/tree/release
