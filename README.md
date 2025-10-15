# tree-sitter-vim-map-side

[Vim's map](https://vimhelp.org/map.txt.html#map.txt) side (`lhs` and `rhs`)
grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

Primaryly intended to be used within `lua`, but also supports `vim` mappings
that `rhs` starts with `:` ([not supported at the moment][ts-vim-map-colon]).

> [!IMPORTANT]
> ABI version: `15`

## Parser requirements

- [`lua`](https://github.com/tree-sitter-grammars/tree-sitter-lua): injection to
  arguments of `vim.keymap.set()` function for `lhs` and `rhs`
- [`vim`](https://github.com/tree-sitter-grammars/tree-sitter-vim) (optional):
  injection to `rhs` when `lhs` starts with `:` and for `command` nodes of this
  grammar.

[ts-vim-map-colon]: https://github.com/tree-sitter-grammars/tree-sitter-vim/blob/3dd4747082d1b717b8978211c06ef7b6cd16125b/test/corpus/map.txt#L278-L281
