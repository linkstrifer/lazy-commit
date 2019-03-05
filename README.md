# Lazy commit

This library helps you to use commit templates and a specific git branch naming convention based on questions.

## Installation

``` bash
$ npm i -S lazy-commit-message
```

## Usage

First, you need a config file, check [the sample config file](config.sample.json).

### Config parametes

#### Questions

`questions` (Array): Every item in the array should be an object, only `id` and `label` properties are required, this will generate a question based on the data, the question type depends on the object properties:
  - only `id` and `label`, expected string answer, `id` will be the variable name to parse in outputs and `label` will be the prompted question text
  - with `options` property, select an option, question answer will be the selected option
  - with `exec` and `output` properties, Yes or No question, question answer will be parsed `output`, `exec` will be a custom command to run after
 
 Examples:
 ``` json
 "questions": [
      {
        "id": "ticketId",
        "label": "Ticket ID:"
      },
      {
        "id": "ticketTitle",
        "label": "Ticket title:"
      },
      {
        "id": "testLink",
        "label": "Want to create a test Link?",
        "exec": "node -e 'console.log(`test command`)'",
        "output": "https://CUSTOM.DOMAIN/${ticketId}-${ticketTitle|slug|limit:32}/"
      }
    ]
```

This will generate 3 questions:

  - `Ticket ID:` (expected string answer)
  - `Ticket title:` (expected string answer)
  - `Want to create a test Link?"` (expected y or n), will run `node -e 'console.log('test command')` after

#### Output

`output` (Array): This will generate the commit message, every new item in the array is a new line in the commit message

Example:

``` json
"output": [
  "${ticketId} || ${ticketTitle}",
  "Ticket url: http://CUSTOM.DOMAIN/${ticketId}",
],
```

This will generate the following commit message:

```
1234 || Ticket title
Ticket url: http://CUSTOM.DOMAIN/1234
```

### Scripts


Supported scripts:

- `commit`
- `new-branch`

#### Commit script

Add `lazy-commit commit` to your `package.json` scripts.

This script will create a commit message based on the configuration file `output`, this is an array, each item of the array is a new line in the commit message, this will commit only the staged files.

Example:

config file:
``` json
{
  "commit": {
    "output": [
      "${ticketId} || ${ticketTitle}",
      "Ticket url: http://CUSTOM.DOMAIN/${ticketId}",
      "Test link: ${testLink}"
    ],
    "questions": [
      {
        "id": "ticketId",
        "label": "Ticket ID:"
      },
      {
        "id": "ticketTitle",
        "label": "Ticket title:"
      },
      {
        "id": "testLink",
        "label": "Want to create a test Link?",
        "options": ["yes", "no"],
        "exec": "node -e 'console.log(`test command`)'",
        "output": "https://CUSTOM.DOMAIN/${ticketId}-${ticketTitle|slug|limit:32}/"
      }
    ]
  },
}
```

#### New branch

Add `lazy-commit new-branch` to your `package.json` scripts.

This script will create a new git branch with the naming convention configured in the lazy commit config file.

Example:

config file:
```
{
  "new-branch": {
    "output": "${type}/${name|slug}",
    "questions": [
      {
        "id": "name",
        "label": "Ticket id and title:"
      },
      {
        "id": "type",
        "label": "Branch type",
        "options": ["feature", "bugfix", "hotfix"]
      }
    ]
  }
}
```

This will generate two questions:
  - `Ticket id and title:` (expecting a string answer)
  - `Branch type:` (select an option from the list [feature, bugfix, hotfix])
  
After answering all the questions, this will create a new branch (i.e: `feature/new-stuff` if you select `feature` branch type and enter `new stuff` as a title)

### TODO

- [ ] No staging changes prompt
- [ ] Save answers for later use
