'use strict';

require('colors');

const script = process.argv[2];

const globalConfig = require('./config.json');

const scripts = {
  'new-branch': require('./lib/tasks/new-branch'),
}

scripts[script](globalConfig);
