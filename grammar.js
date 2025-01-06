const terra = require('tree-sitter-terra/grammar')
/**
 * @file Tree sitter grammar for terra witht language extensions
 * @author Torsten Keßler <t.kessler@posteo.de> <t.kessler@posteo.de>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// copied from the lua grammar
const list_seq = (rule, separator, trailing_separator = false) =>
  trailing_separator
    ? seq(rule, repeat(seq(separator, rule)), optional(separator))
    : seq(rule, repeat(seq(separator, rule)));

const optional_block = ($) => alias(optional($._block), $.block);

module.exports = grammar(terra, {
  name: "exoterra",

  rules: {
    test_statement: ($) => seq(
      'test',
      $.expression
    ),

    testset_statement: ($) => seq(
      'testset',
      optional($.arguments),
      field('description', $.string),
      'do',
      field('body', optional_block($)),
      'end'
    ),

    testenv_statement: ($) => seq(
      'testenv',
      optional($.arguments),
      field('description', $.string),
      'do',
      field('body', optional_block($)),
      'end'
    ),

    terracode_statement: ($) => seq(
      'terracode',
      field('body', optional_block($)),
      'end'
    ),

    statement: ($, old) => choice(
      old,
      $.test_statement,
      $.testset_statement,
      $.testenv_statement,
      $.terracode_statement,
    ),
  }
});
