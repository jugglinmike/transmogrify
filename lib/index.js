"use strict";

var recast = require("recast");

// Add visitors directly to the transforms object to be accessible.
var transforms = {
  // Internal visitor transformers.
  cjs: require("./transform/cjs"),
  amd: require("./transform/amd"),
  browser: require("./transform/browser")
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
  var visitors = inputTransform.concat(outputTransform).filter(Boolean);

  // Parse the source and generate a mutable AST object.
  var ast = recast.parse(source, {
    sourceFileName: "source.js"
  });

  // Attach custom state to the AST object.
  ast.imports = [];
  ast.exports = [];

  // Call each visitor with the AST.
  visitors.forEach(function(visitor) {
    visitor(ast);
  });

  return recast.print(ast, {
    sourceMapName: "map.json"
  });
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
