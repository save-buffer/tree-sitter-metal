package tree_sitter_metal_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_metal "github.com/save-buffer/tree-sitter-metal/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_metal.Language())
	if language == nil {
		t.Errorf("Error loading Metal grammar")
	}
}
