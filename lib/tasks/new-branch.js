const simpleGit = require('simple-git')()

const {
  errorHandler,
  generateQuestions,
  parseOutput,
} = require('../shared/utils')

/**
 * Create branch with the name based on the ticket id and title
 * @param {object} globalConfig
 */
function createBranch(globalConfig) {
  const config = globalConfig['new-branch']
  const { questions, output } = config

  const variables = generateQuestions(questions)

  if (variables === null) {
    return
  }

  const branchName = parseOutput(output, variables)

  simpleGit.checkoutLocalBranch(branchName)
}

module.exports = createBranch
