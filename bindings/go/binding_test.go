package tree_sitter_exoterra_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_exoterra "github.com/tpkessler/tree-sitter-exoterra/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_exoterra.Language())
	if language == nil {
		t.Errorf("Error loading Exoterra grammar")
	}
}
