package tree_sitter_vim_map_side_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_vim_map_side "github.com/hdoc1509/tree-sitter-vim-map-side/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_vim_map_side.Language())
	if language == nil {
		t.Errorf("Error loading VimMapSide grammar")
	}
}
