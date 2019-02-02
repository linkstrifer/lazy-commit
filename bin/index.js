require('colors');
const simpleGit = require('simple-git')();

const script = process.argv[2];

const globalConfig = require('./config.json');

const scripts = {
  'new-branch': createBranch,
}

const {
  errorHandler,
  generateQuestion,
  parseOutput,
} = require('./utils');

/**
 * Create branch with the name based on the ticket id and title slugified
 */
function createBranch() {
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

scripts[script]()
