const assert = require('assert')

const template = '${a}/${b}'
const variables = {
  a: 'variableA',
  b: 'variable-B',
}

const { parseTemplate } = require('../../../lib/shared/utils')

describe('ParseTemplate', function() {
  it('Should parse a template', function() {
    assert.equal(
      parseTemplate(template, variables),
      `${variables.a}/${variables.b}`
    )
  })

  it('Empty template, should return empty string', function() {
    assert.equal(parseTemplate('', variables), '')
  })

  it('Null template, should return empty string', function() {
    assert.equal(parseTemplate(null, variables), '')
  })

  it('Load a string instead of a variables object, should return parsed template with empty string instead of undefined variables', function() {
    assert.equal(parseTemplate(template, ''), template)
  })

  it('Load a number instead of a variables object, should return parsed template with empty string instead of undefined variables', function() {
    assert.equal(parseTemplate(template, 1234), template)
  })

  it('Load null instead of a variables object, should return parsed template with empty string instead of undefined variables', function() {
    assert.equal(parseTemplate(template, null), template)
  })
})
