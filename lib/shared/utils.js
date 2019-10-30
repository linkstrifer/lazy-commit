const readline = require('readline-sync')
const shell = require('shelljs')

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
function generateQuestion({ defaultValue, question, variables }) {
  const { exec, label, options, output, multiple } = question
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
          shell.exec(command, [], resolve)
        } catch (error) {
          console.log(`ERROR: ${error}`.red)
          reject(error)
        }
      })
    }
  } else if (options) {
    if (multiple) {
      let selectedOptions = []

      while (true) {
        const selectedOption =
          options[
            readline.keyInSelect(options, `${label}`.cyan, {
              cancel: 'Next question'.green,
            })
          ]

        if (!selectedOption) {
          break
        }

        if (selectedOptions.includes(selectedOption)) {
          selectedOptions = selectedOptions.filter(
            option => option !== selectedOption
          )
        } else {
          selectedOptions.push(selectedOption)
        }

        console.log('  Selected'.cyan, `${selectedOptions}`.green)
      }

      answer = selectedOptions
    } else {
      answer =
        options[
          readline.keyInSelect(options, `${label}`.cyan, {
            cancel: 'Cancel'.red,
          })
        ]
    }

    if (!answer) {
      console.log('Abort'.red)
      return null
    }
  } else {
    answer = readline.question(`${label} `.cyan)
  }

  return answer.trim ? answer.trim() : answer
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
  if (!variables || typeof variables !== 'object') {
    return template
  }

  if (!template) {
    return ''
  }

  let variablesAssignation =
    'const ' +
    Object.keys(variables)
      .map(variable => `${variable} = ${JSON.stringify(variables[variable])}`)
      .join(', ')

  const evalString = `(function() {
    ${variablesAssignation}

    return ${'`' + template.replace(/'/g, '`') + '`'}
  })()`

  console.log(evalString.red)

  return eval(evalString)
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
    return template.map(templateFromArray =>
      parseOutput(templateFromArray, variables)
    )
  }
}

module.exports = {
  generateQuestion,
  generateQuestions,
  parseOutput,
  parseTemplate,
}
