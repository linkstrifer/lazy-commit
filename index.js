'use strict';

require('colors');

const script = process.argv[2];
const loadConf = require('app-root-path').require;
let globalConfig;

try {
  globalConfig = loadConf('/lazy-commit.config.json');
} catch (error) {
  try {
    globalConfig = require('./config.json');
  } catch (error) {
    console.log('No config file'.red);
  }
}

const scripts = {
  commit: require('./lib/tasks/commit'),
  'new-branch': require('./lib/tasks/new-branch'),
};

if (globalConfig) {
  scripts[script](globalConfig);
}
