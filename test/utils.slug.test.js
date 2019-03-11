const assert = require('assert')

const {
  slug,
} = require('../lib/shared/utils')

const testString = 'slug " - / |  string 1234 _ á '
const slugifiedString = 'slug-string-1234-_-a'

describe('Slug filter', function() {
  it('Should slugify a string', function() {
    assert.equal(
      slug(testString),
      slugifiedString
    )
  })

  it('Empty string, should return an empty string', function() {
    assert.equal(
      slug(''),
      ''
    )
  })

  it('Number, should return a string', function() {
    assert.equal(
      slug(1234),
      '1234'
    )
  })

  it('Boolea, should return a string', function() {
    assert.equal(
      slug(true),
      'true'
    )
  })

  it('Null, should return an empty string', function() {
    assert.equal(
      slug(null),
      ''
    )
  })
})