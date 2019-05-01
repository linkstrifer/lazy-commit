const assert = require('assert')

const {
  createCheckpointFile,
} = require('../../../lib/shared/checkpoint')

describe('Checkpoint util', function() {
  it('Should create a file', function() {
    createCheckpointFile()
  })
})
