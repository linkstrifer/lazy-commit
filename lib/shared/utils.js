const readline = require('readline-sync');
const slugify = require('slugify');

const filters = {
  slug,
};

/**
 * Error handler function, just get the error and dye it red
 */
function errorHandler(error) {
  console.log('An error ocurred'.red);
  console.log(error);
}

/**
 * Generate question
 * @param {object} question
 * @param {array} question.options
 * @param {string} question.label
 * @returns {string} answer
 */
function generateQuestion(question) {
  const {
    label,
    options,
  } = question;
  let answer;

  if (options) {
    answer = options[readline.keyInSelect(options, `${label}`.cyan)];

    if (!answer) {
      console.log('Abort'.red);
      return null;
    }
  } else {
    answer = readline.question(`${label} `.cyan);
  }

  return answer;
}

/**
 * Parse template
 * @param {string} outputTemplate
 * @param {object} variables
 * @returns {string} parsedOutput
 */
function parseTemplate(template, variables) {
  let output = template;
  const variableNames = output.match(/(\$\{(\w+\|*\w*)\})/g);

  variableNames.map((variableName) => {
    const filter = variableName.replace(/(\$\{)*\}*/g, '').split('|');
    let variableValue = variables[
      filter[0]
    ];

    if (filter[1] && filters[filter[1]]) {
      variableValue = filters[filter[1]](variableValue);
    }

    output = output.replace(variableName, variableValue);
  });

  return output;
}

/**
 * Parse output
 * @param {string|array} outputTemplate
 * @param {object} variables
 * @returns {string} parsedOutput
 */
function parseOutput(template, variables) {
  if (typeof template === 'string') {
    return parseTemplate(template, variables);
  } else {
    return template.map((templateFromArray) => parseOutput(templateFromArray, variables));
  }
}

/**
 * Slug string
 * @param {string} input
 * @returns {string} slugified string
 */
function slug(input) {
  return slugify(input.replace(/\/*\:*/g, ''));
}

module.exports = {
  errorHandler,
  generateQuestion,
  parseOutput,
};
