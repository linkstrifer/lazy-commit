# 1. Lazy commit

This library helps you to use commit templates and a specific git branch naming convention based on questions.

<!-- TOC -->

- [Lazy commit](#lazy-commit)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Config parametes](#config-parametes)
      - [Questions](#questions)
      - [Output](#output)
    - [Scripts](#scripts)
      - [Commit script](#commit-script)
      - [New branch](#new-branch)

<!-- /TOC -->

## 1.1. Installation

```bash
$ npm i -S lazy-commit-message
```

## 1.2. Usage

First, you need a config file, check [the sample config file](config.sample.json).

### 1.2.1. Config parameters

#### 1.2.1.1. Questions

`questions` (Array): Every item in the array should be an object, only `id` and `label` properties are required, this will generate a question based on the data, the question type depends on the object properties:

- only `id` and `label`, expected string answer, `id` will be the variable name to parse in outputs and `label` will be the prompted question text
- with `options` property, select an option, question answer will be the selected option
- with `exec` and `output` properties, Yes or No question, question answer will be parsed `output`, `exec` will be a custom command to run after

Examples:

```json
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
       "output": "https://CUSTOM.DOMAIN/${ticketId}-${ticketTitle}/"
     },
     {
       "id": "type",
       "label": "Type:",
       "options": ["feature", "hotfix"]
     },
     {
       "id": "locales",
       "label": "Affected locales:",
       "options": ["en-us", "es-us", "ja-jp"],
       "multiple": true
     }
   ]
```

This will generate 5 questions:

- `Ticket ID:` (expected string answer)
- `Ticket title:` (expected string answer)
- `Want to create a test Link?"` (expected y or n), will run `node -e 'console.log('test command')` after
- `Type:` (multiple option selector, only one answer)
- `Affected locales:` (multiple option selector, multiple answer)

#### 1.2.1.2. Output

`output` (Array): This will generate the commit message, every new item in the array is a new line in the commit message, it can accept javascript expressions using string literal syntax

Example:

```json
"output": [
  "${ticketId} || ${ticketTitle}",
  "Ticket url: http://CUSTOM.DOMAIN/${ticketId}",
  "Type: ${type}",
  "Affected locales: ${locales.join(', ')}"
],
```

This will generate the following commit message with the following answers:

```
ticketId = 1234
ticketTitle = Awesome feature
type = feature
locales = en-us, es-us
```

```
1234 || Awesome feature
Ticket url: http://CUSTOM.DOMAIN/1234
Type: feature
Affected locales: en-us, es-us
```

### 1.2.2. Scripts

Supported scripts:

- `commit`
- `new-branch`

#### 1.2.2.1. Commit script

Add `lazy-commit commit` to your `package.json` scripts.

This script will create a commit message based on the configuration file `output`, this is an array, each item of the array is a new line in the commit message, this will commit only the staged files.

Example:

config file:

```json
{
  "commit": {
    "output": [
      "${ticketId} || ${ticketTitle}",
      "Ticket url: http://CUSTOM.DOMAIN/${ticketId}",
      "Type: ${type}",
      "Affected locales: ${locales.join(', ')}"
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
        "exec": "node -e 'console.log(`test command`)'",
        "output": "https://CUSTOM.DOMAIN/${ticketId}-${ticketTitle}/"
      },
      {
        "id": "type",
        "label": "Type:",
        "options": ["feature", "hotfix"]
      },
      {
        "id": "locales",
        "label": "Affected locales:",
        "options": ["en-us", "es-us", "ja-jp"],
        "multiple": true
      }
    ]
  }
}
```

#### 1.2.2.2. New branch

Add `lazy-commit new-branch` to your `package.json` scripts.

This script will create a new git branch with the naming convention configured in the lazy commit config file.

Example:

config file:

```
{
  "new-branch": {
    "output": "${type}/${name}",
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
