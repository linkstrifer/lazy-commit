const assert = require('assert')

const testQuestions = [
  {
    label: 'Test question 1',
  },
  {
    label: 'Question with options',
    options: [1, 2, 3, 4],
  },
  {}
]

const testAnswers = [
  'Answer 1',
  1,
]

const {
  generateQuestion,
} = require('../../../lib/shared/utils')

// describe('GenerateQuestion util', function() {
//   it('Should return the input answer', function() {
//     assert.equal(
//       generateQuestion(testQuestions[0], testAnswers[0]),
//       testAnswers[0]
//     )
//   })

//   it('Question with options, should return the selected option', function() {
//     assert.equal(
//       generateQuestion(testQuestions[1], testAnswers[1]),
//       testAnswers[1]
//     )
//   })
// })