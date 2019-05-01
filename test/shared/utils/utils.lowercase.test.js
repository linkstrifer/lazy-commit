const assert = require('assert')

const {
  lowercase,
} = require('../../../lib/shared/utils')

describe('Lowercase a string', function() {
  it('Should return lowercase', function() {
    assert.equal(
      lowercase('UPPERCASE'),
      'uppercase'
    )
  })

  it('Number, should return a string', function() {
    assert.equal(
      lowercase(1234),
      '1234'
    )
  })

  it('Boolean, should return a string', function() {
    assert.equal(
      lowercase(true),
      'true'
    )
  })

  it('Empty string, should return null', function() {
    assert.equal(
      lowercase(''),
      null
    )
  })

  it('Null string, should return null', function() {
    assert.equal(
      lowercase(null),
      null
    )
  })
})
