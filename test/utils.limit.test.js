const assert = require('assert')

const {
  limit,
} = require('../lib/shared/utils')

describe('Limit string filter', function() {
  it('Should return a 10 characters string', function() {
    assert.equal(
      limit(
        'Super loooooooooooooong string', 10),
        'Super looo'
      )
  })

  it('Should return a 15 characters string', function() {
    assert.equal(
      limit(
        'Super loooooooooooooong string', 15),
        'Super loooooooo'
      )
  })

  it('Number, should return a string', function() {
    assert.equal(
      limit(
        1234, 10),
        '1234'
      )
  })

  it('Boolean, should return a string', function() {
    assert.equal(
      limit(
        true, 10),
        'true'
      )
  })

  it('Empty string, should return null', function() {
    assert.equal(
      limit(
        '', 10),
        null
      )
  })

  it('Null string, should return null', function() {
    assert.equal(
      limit(
        null, 10),
        null
      )
  })
})
