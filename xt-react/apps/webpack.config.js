'use strict';

var path = require('path');
var args = require('minimist')(process.argv.slice(2));

// List of allowed environments
var allowedEnvs = ['dev', 'production', 'test'];

// Set the correct environment
var env;
if(args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'test';
} else if (args.env) {
  env = args.env;
} else {
  env = 'dev';
}

// Get available configurations
var configs = {
  dev: require(path.join(__dirname, 'cfg/dev')),
  production: require(path.join(__dirname, 'cfg/dist')),
  test: require(path.join(__dirname, 'cfg/test')),
  colors: true
};

/**
 * Get an allowed environment
 * @param  {String}  env
 * @return {String}
 */
function getValidEnv(env) {
  var isValid = env && env.length > 0 && allowedEnvs.indexOf(env) !== -1;
  return isValid ? env : 'dev';
}

/**
 * Build the webpack configuration
 * @param  {String} env Environment to use
 * @return {Object} Webpack config
 */
function buildConfig(env) {
  var usedEnv = getValidEnv(env);
  removeI18nForSomeProducts(configs[usedEnv]);
  return configs[usedEnv];
}

/**
 * Remove webpack I18N feature for some products
 * @param  {Object} Webpack config with I18N
 * @return {Object} Webpack config no I18N
 */
function removeI18nForSomeProducts(configs) {
  if(process.env.product === 'myphoto') {
    delete configs.entry.i18n
  }
  return configs
}

module.exports = buildConfig(env);
