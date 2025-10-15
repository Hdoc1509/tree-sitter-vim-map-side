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
that `rhs` starts with `:` ([not supported at the moment][ts-vim-map-colon]).

> [!IMPORTANT]
> ABI version: `15`

## Parser requirements

- [`lua`](https://github.com/tree-sitter-grammars/tree-sitter-lua): injection to
  arguments of `vim.keymap.set()` function for `lhs` and `rhs`
- [`vim`](https://github.com/tree-sitter-grammars/tree-sitter-vim) (optional):
  injection to `rhs` when it starts with `:` and to `command` nodes of this
  grammar.

[ci]: https://github.com/Hdoc1509/tree-sitter-vim-map-side/actions/workflows/ci.yml/badge.svg
[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix
[crates]: https://img.shields.io/crates/v/tree-sitter-vim-map-side?logo=rust
[npm]: https://img.shields.io/npm/v/tree-sitter-vim-map-side?logo=npm
[pypi]: https://img.shields.io/pypi/v/tree-sitter-vim-map-side?logo=pypi&logoColor=ffd242
[ts-vim-map-colon]: https://github.com/tree-sitter-grammars/tree-sitter-vim/blob/3dd4747082d1b717b8978211c06ef7b6cd16125b/test/corpus/map.txt#L278-L281
