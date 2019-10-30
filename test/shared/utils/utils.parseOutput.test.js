const assert = require('assert')

const templates = [
  '${a}/${b}',
  '${c}/${d}',
  'first/1 first/2 first/3 second/1 second/2 second/3 third/1 third/2 third/3',
]

const variables = {
  a: 'variableA',
  b: 'variable-B',
  c: 'variable C',
  d: 'variable_D',
  e: ['first', 'second', 'third'],
  f: [1, 2, 3],
}

const parsedTemplates = [
  `${variables.a}/${variables.b}`,
  `${variables.c}/${variables.d}`,
  `${variables.e
    .map(p => variables.f.map(n => `${p}/${n}`).join(' '))
    .join(' ')}`,
]

const { parseOutput } = require('../../../lib/shared/utils')

describe('ParseOutput util', function() {
  it('Should parse templates', function() {
    assert.deepEqual(parseOutput(templates, variables), parsedTemplates)
  })

  it('Should parse a single template', function() {
    assert.equal(parseOutput(templates[0], variables), parsedTemplates[0])
  })

  it('Empty template, should return empty string', function() {
    assert.equal(parseOutput('', variables), '')
  })

  it('Null template, should return empty string', function() {
    assert.equal(parseOutput(null, variables), '')
  })

  it('String instead of variables object, should return parsed templates with empty string instead of undefined variables', function() {
    assert.deepEqual(parseOutput(templates, ''), templates)
  })

  it('Null instead of variables object, should return parsed templates with empty string instead of undefined variables', function() {
    assert.deepEqual(parseOutput(templates, null), templates)
  })

  it('Boolean instead of variables object, should return parsed templates with empty string instead of undefined variables', function() {
    assert.deepEqual(parseOutput(templates, true), templates)
  })

  it('Missing variables parameter, should return parsed templates with empty string instead of undefined variables', function() {
    assert.deepEqual(parseOutput(templates), templates)
  })

  it('No parameters, should return empty string', function() {
    assert.equal(parseOutput(), '')
  })
})
