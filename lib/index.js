"use strict";

var jstransform = require("jstransform");

// Internal visitor transformers.
var cjs = require("./transform/cjs");
var amd = require("./transform/amd");
var browser = require("./transform/browser");

// Add visitors directly to the transforms object to be accessible.
var transforms = {
  cjs: cjs,
  amd: amd,
  browser: browser
};

/**
 * Converts source code from one module format to the other.
 *
 * @param {string} source - The source code to convert.
 * @param {string} input - The name of the input format.
 * @param {string} output - The name of the output format.
 * @param {Object} context - An optional context to use.
 * @return {Object} Containing the sourcemap and generated source code.
 */
function transmogrify(source, input, output, context) {
  var inputTransform = transforms[input].input;
  var outputTransform = transforms[output].output;

  // Filter out missing transforms.
  var visitors = inputTransform.concat(outputTransform).filter(Boolean);
  
  // Process the visitors as serially invoked transforms.
  return jstransform.transform(visitors, source, { sourceMap: true });
}

/**
 * Expose the internally used transforms object so that others may augment with
 * different input/output transformers.
 * 
 * @public
 * @type {Object}
 */
transmogrify.transforms = transforms;

module.exports = transmogrify;
