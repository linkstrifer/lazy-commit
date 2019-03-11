const readline = require('readline-sync')
const slugify = require('slugify')
const shell = require('shelljs')

const filters = {
  slug,
  limit,
}

/**
 * Limit characters filter
 * @param {string} input string
 * @param {number} max length
 * @returns string
 */
function limit(string, max) {
  if (string) {
    return `${string}`.substring(0, max)
  } else {
    return null
  }
}

/**
 * Generate question
 * @param {object}  config
 * @param {object}  config.question
 * @param {array}   config.question.options
 * @param {string}  config.question.label
 * @param {string}  config.defaultValue
 * @param {object}  config.variables
 * @returns {string} answer
 */
function generateQuestion({
  defaultValue,
  question,
  variables,
}) {
  const {
    exec,
    label,
    options,
    output,
  } = question
  let answer

  if (defaultValue !== undefined) {
    return defaultValue
  }

  if (exec) {
    const command = parseTemplate(exec, variables)
    const shouldRun = readline.keyInYNStrict(`${label}`.cyan)

    if (shouldRun) {
      answer = parseTemplate(output, variables)
  
      new Promise((resolve, reject) => {
        try {
          shell.exec(command, [], resolve);
        } catch(error) {
          console.log(`ERROR: ${error}`.red);
          reject(error);
        }
      })
    }
  } else if (options) {
    answer = options[readline.keyInSelect(options, `${label}`.cyan)]

    if (!answer) {
      console.log('Abort'.red)
      return null
    }
  } else {
    answer = readline.question(`${label} `.cyan)
  }

  return answer
}

/**
 * Generate questions
 * @param {Array} questions
 * @param {Object} defaultValues
 * @return {Object} variables
 */
function generateQuestions(questions, defaultValues) {
  let variables = {}

  console.log('Ctrl + C to exit at any time'.yellow || '')

  for (let i = 0; i < questions.length; i++) {
    const result = generateQuestion({
      defaultValues: defaultValues && defaultValues[questions[i].id],
      question: questions[i],
      variables,
    })

    variables[questions[i].id] = result

    if (result === null) {
      variables = null
      break
    }
  }

  return variables
}

/**
 * Parse template
 * @param {string} outputTemplate
 * @param {object} variables
 * @returns {string} parsedOutput
 */
function parseTemplate(template, variables) {
  let output = template || ''
  const variableNames = output.match(/\$\{(\w(\|(.)*)*)+\}/g) || []

  variableNames.map((variableName) => {
    const filter = variableName.replace(/(\$\{)*\}*/g, '').split('|')
    let variableValue = variables && variables[
      filter[0]
    ]

    if (filter.length > 1) {
      for (let i = 1; i < filter.length; i++) {
        const [filterName, params] = filter[i].split(':')

        variableValue = filters[filterName](variableValue, params)
      }
    }

    output = output.replace(variableName, variableValue || '')
  })

  return output
}

/**
 * Parse output
 * @param {string|array} outputTemplate
 * @param {object} variables
 * @returns {string} parsedOutput
 */
function parseOutput(template, variables) {
  if (!template) {
    return ''
  } else if (typeof template === 'string') {
    return parseTemplate(template, variables)
  } else {
    return template.map((templateFromArray) => parseOutput(templateFromArray, variables))
  }
}

/**
 * Slug string
 * @param {string} input
 * @returns {string} slugified string
 */
function slug(input) {
  return input ? slugify(`${input}`.replace(/[\(\)\:\/\"]/g, '')) : ''
}

module.exports = {
  generateQuestion,
  generateQuestions,
  limit,
  parseOutput,
  parseTemplate,
  slug,
}
