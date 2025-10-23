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
> More expressions will be supported in the future.

## Parser requirements

- [`lua`][ts-lua]: injection to arguments of `vim.keymap.set()` function for
  `lhs` and `rhs`
- [`printf`][ts-printf] (optional): injection to first argument of `printf()`
  expression.
- [`vim`][ts-vim] (optional): injection to `rhs` when it starts with `:` and to
  `command` nodes of this grammar.

## Usage in Editors

### Neovim

#### Requirements

- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [Node.js](https://nodejs.org/en/download/) (if ABI not compatible)
- [tree-sitter cli](https://github.com/tree-sitter/tree-sitter/tree/master/crates/cli)
  (if ABI not compatible)

#### Installation

1. Add the following to your `nvim-treesitter` configuration:

   ```lua
   local parser_config = require ("nvim-treesitter.parsers").get_parser_configs()

   -- NOTE: add the parser to `parser_config` before calling `.setup()`
   parser_config.vim_map_side = {
     install_info = {
       url = 'https://github.com/Hdoc1509/tree-sitter-vim-map-side',
       files = { 'src/parser.c' },
       -- can also use 'deploy-vX.X.X' for specific version or full commit hash
       revision = 'release', -- latest released version
       -- if ABI version from neovim doesn't match the one from this grammar
       -- requires Node.js and tree-sitter cli to be installed
       requires_generate_from_grammar = true,
     },
   }

   require('nvim-treesitter.configs').setup({
     ensure_installed = {
       -- other parsers
       'lua', -- required
       'printf', -- optional
       'vim', -- optional
       'vim_map_side', -- this parser
     },
     -- other options
   })
   ```

2. Copy the queries from [`queries`](./queries) directory to
   `queries/vim_map_side` directory in your `neovim` configuration directory:

   | With                  | Path                    |
   | --------------------- | ----------------------- |
   | Unix                  | `~/.config/nvim`        |
   | Windows               | `~/AppData/Local/nvim`  |
   | `XDG_CONFIG_HOME` set | `$XDG_CONFIG_HOME/nvim` |

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

Where `X.X.X` is the version of the grammar.

## Injections

> [!NOTE]
> If you are using Neovim, you can use `lua-match?` and `not-lua-match?`
> predicates instead of `match?` and `not-match?`.

### `lua` parser

For `vim.keymap.set()` function of `neovim`:

```query
; NOTE: for lhs
(function_call
  name: (dot_index_expression) @_fn
  arguments: (arguments
    .
    (_) ; -- mode --
    .
    (string
      (string_content) @injection.content))
  (#eq? @_fn "vim.keymap.set")
  (#match? @injection.content "<.+>")
  (#set! injection.language "vim_map_side"))

; NOTE: for general rhs
(function_call
  name: (dot_index_expression) @_fn
  arguments: (arguments
    .
    (_) ; -- mode --
    .
    (_) ; -- lhs --
    .
    (string
      (string_content) @injection.content))
  (#eq? @_fn "vim.keymap.set")
  (#match? @injection.content "<.+>")
  (#set! injection.language "vim_map_side"))

; NOTE: for `:` rhs without keycode
(function_call
  name: (dot_index_expression) @_fn
  arguments: (arguments
    .
    (_) ; -- mode --
    .
    (_) ; -- lhs --
    .
    (string
      (string_content) @injection.content))
  (#eq? @_fn "vim.keymap.set")
  (#not-match? @injection.content "<.+>")
  (#match? @injection.content "^:")
  (#set! injection.language "vim_map_side"))

; NOTE: for expressions as rhs
(function_call
  name: (dot_index_expression) @_fn
  arguments: (arguments
    .
    (_) ; -- mode --
    .
    (_) ; -- lhs --
    .
    (string
      (string_content) @injection.content)
    .
    (table_constructor) @_options)
  (#eq? @_fn "vim.keymap.set")
  ; NOTE: to avoid double injection
  (#not-match? @injection.content "<.+>")
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
