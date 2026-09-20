const serialize = require('serialize-javascript');
const _ = require('lodash');
const minimist = require('minimist');

// !! XSS via serialize - user input serialized without sanitization
function processData(userInput) {
  return serialize(userInput); // CVE-2020-7660
}

// !! PROTOTYPE POLLUTION via minimist
function parseArgs(args) {
  return minimist(args); // allows --__proto__[admin]=true
}

// !! DEEP MERGE without prototype protection
function mergeConfigs(base, override) {
  return _.defaultsDeep({}, override, base); // vulnerable deep merge
}

// !! EVAL of user input
function runScript(code) {
  return eval(code); // never do this
}

module.exports = { processData, parseArgs, mergeConfigs, runScript };
