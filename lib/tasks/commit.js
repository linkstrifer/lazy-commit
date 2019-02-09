const simpleGit = require('simple-git')();

const {
  errorHandler,
  generateQuestion,
  parseOutput,
} = require('../shared/utils');

const separator = '----------------------------------------------------------------';

/**
 * Commit
 * Ask for some data to generate a commit message using a template
 * @param {object} globalConfig
 */
async function commit(globalConfig) {
  let abort = false;
  const config = globalConfig['commit'];
  const {
    questions,
    output,
  } = config;
  const variables = {};

  console.log('Ctrl + C to exit at any time'.yellow);

  questions.map((question) => {
    variables[question.id] = generateQuestion(question);

    if (variables[question.id] === null) {
      abort = true;
    }
  });

  if (abort) {
    return;
  }

  const commitMessageArray = parseOutput(output, variables);

  console.log(commitMessageArray);

  simpleGit.commit(
    commitMessageArray,
    [],
    (error, data) => {
      if (error) {
        errorHandler(error)
      } else {
        const {
          branch,
          commit,
          summary,
        } = data;

        const {
          insertions,
          deletions,
          changes,
        } = summary;

        console.log(separator);

        if (commit) {
          console.log(
            'Commit',
            `${commit}`.green,
            'created in branch',
            `${branch}`.green,
          );

          console.log(`-+${changes}`.magenta, `++${insertions}`.green, `--${deletions}`.red);
          simpleGit.log(['-1', '--pretty=%B'], (error, log) => {
            if (error) {
              errorHandler(error);

              return;
            }

            const { latest } = log;
            const { hash } = latest;

            console.log('Commit message:'.magenta);

            console.log(hash);

            console.log(separator);
          })
        } else {
          console.log('Nothing to commit'.red);
        }

        console.log(separator);
      }
    });
}

module.exports = commit;
