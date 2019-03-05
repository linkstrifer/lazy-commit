const assert = require('assert')

const templates = [
  '${a}/${b}',
  '${c}/${d}'
]

const variables = {
  a: 'variableA',
  b: 'variable-B',
  c: 'variable C',
  d: 'variable_D',
}


const parsedTemplates = [
  `${variables.a}/${variables.b}`,
  `${variables.c}/${variables.d}`,
]

const {
  parseOutput,
} = require('../lib/shared/utils')

describe('ParseOutput util', function() {
  it('Should parse templates', function() {
    assert.deepEqual(
      parseOutput(templates, variables),
      parsedTemplates
    )
  })

  it('Should parse a single template', function() {
    assert.equal(
      parseOutput(templates[0], variables),
      parsedTemplates[0]
    )
  })

  it('Empty template, should return empty string', function() {
    assert.equal(
      parseOutput('', variables),
      ''
    )
  })

  it('Null template, should return empty string', function() {
    assert.equal(
      parseOutput(null, variables),
      ''
    )
  })

  it('Empty variables object, should return unparsed templates', function() {
    assert.deepEqual(
      parseOutput(templates, {}),
      templates
    )
  })

  it('String instead of variables object, should return unparsed templates', function() {
    assert.deepEqual(
      parseOutput(templates, ''),
      templates
    )
  })

  it('Null instead of variables object, should return unparsed templates', function() {
    assert.deepEqual(
      parseOutput(templates, null),
      templates
    )
  })

  it('Boolean instead of variables object, should return unparsed templates', function() {
    assert.deepEqual(
      parseOutput(templates, true),
      templates
    )
  })

  it('Missing variables parameter, should return unparsed templates', function() {
    assert.deepEqual(
      parseOutput(templates),
      templates
    )
  })

  it('No parameters, should return empty string', function() {
    assert.equal(
      parseOutput(),
      ''
    )
  })
})