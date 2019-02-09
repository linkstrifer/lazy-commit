const simpleGit = require('simple-git')();

const {
  errorHandler,
  generateQuestion,
  parseOutput,
} = require('../shared/utils');

/**
 * Create branch with the name based on the ticket id and title slugified
 */
function createBranch(globalConfig) {
  let abort = false;
  const config = globalConfig['new-branch'];
  const {
    questions,
    output,
  } = config;
  const variables = {};

  questions.map((question) => {
    variables[question.id] = generateQuestion(question);

    if (variables[question.id] === null) {
      abort = true;
    }
  });

  if (abort) {
    return;
  }

  const branchName = parseOutput(output, variables);

  simpleGit.checkoutLocalBranch(branchName);
}

module.exports = createBranch;
