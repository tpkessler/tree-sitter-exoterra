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

    
    terraform_function_definition: ($) => seq(
      'terraform',
      $._terraform_function_body      
    ),

    terraform_function_implementation: ($) => seq(
      'terraform',
      field('name', $._function_name),
      $._terraform_function_body
    ),

    _local_terraform_function_implementation: ($) => seq(
      'local',
      'terraform',
      field('name', choice($.identifier, $.escape_expression)),
      $._terraform_function_body
    ),

    _terraform_function_body: ($) => seq(
      field('parameters', $.terraform_function_parameters),
      optional(field('concepts', $.type_constraints)),
      field('body', optional_block($)),
      'end'
    ),

    terraform_function_parameters: ($) => seq(
      '(',
      optional($._terraform_parameter_list),
      ')',
    ),

    type_constraints: ($) => seq(
      'where',
      '{',
      optional($._constrained_types_list),
      '}'
    ),

    _terraform_parameter_list: ($) => choice(
      seq(
        list_seq(
          choice(
            $._typed_declaration,
            $.identifier,
            $.escape_expression,
          ),
          ','
        ),
        optional(seq(',', $.terraform_vararg_expression))
      ),
      $.terraform_vararg_expression
    ),

    terraform_vararg_expression: ($) => seq(
      field('name', $.identifier),
      $.vararg_expression
    ),

    _constrained_types_list: ($) => list_seq(
      choice(
        $.identifier,
        seq($.identifier, ':', choice($.string, $.number, $._type_specifier)),
      ),
      ','
    ),

    concept_implementation: ($) => seq(
      'concept',
      field('name', $._function_name),
      $._concept_body,
    ),

    _local_concept_implementation: ($) => seq(
      'local',
      'concept',
      field('name', choice($.identifier, $.escape_expression)),
      $._concept_body,
    ),

    _regular_concept_body: ($) => seq(
      field('body', optional_block($)),
      'end'
    ),

    _parametrized_concept_body: ($) => seq(
      field(
        'parameters',
        seq('(', optional(list_seq($.expression, ',')), ')')
      ),
      field('concepts', $.type_constraints),
      field('body', optional_block($)),
      'end'
    ),

    _concept_body: ($) => choice(
      $._regular_concept_body,
      $._parametrized_concept_body,
    ),

    declaration: ($, old) => choice(
      old,
      $.terraform_function_implementation,
      alias(
        $._local_terraform_function_implementation,
        $.terraform_function_implementation
      ),
      $.concept_implementation,
      alias(
        $._local_concept_implementation,
        $.concept_implementation
      ),
    ),

    expression: ($, old) => choice(
      old,
      $.terraform_function_definition,
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
