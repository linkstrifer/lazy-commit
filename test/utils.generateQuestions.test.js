const assert = require('assert')

const testQuestions = [
  {
    id: 1,
    label: 'Test question',
  },
  {
    id: 2,
    label: 'Question with options',
    options: [1, 2, 3, 4],
  },
]

const testAnswers = {
  1: 'answer 1',
  2: 'answer',
}

const {
  generateQuestions,
} = require('../lib/shared/utils')

// describe('GenerateQuestions util', function() {
//   it('Should return the input answer', function() {
//     assert.deepEqual(
//       generateQuestions(testQuestions, testAnswers),
//       testAnswers
//     )
//   })

//   it('No questions, should return empty object', function() {
//     assert.deepEqual(
//       generateQuestions({}),
//       {}
//     )
//   })
// })