"use strict";

var utils = require("jstransform/src/utils");

// The position of the function expression.
var functionPosition = null;

/**
 * Unwraps an AMD module.
 *
 * @param {Function} traverse - Some kind of traversal method.
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return
 */
function unwrapVisitor(traverse, node, path, state) {
}

/**
 * Find all `define` function calls.
 *
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return {boolean} Whether or not the node is a `define` function call.
 */
unwrapVisitor.test = function(node, path, state) {
  var isWrappedFunction = false;

  if (node.type === "CallExpression" && node.callee.name === "define") {
    // Get the function contents body.
    isWrappedFunction = Boolean(node.arguments.filter(function(arg, i) {
      // Set the function position.
      functionPosition = i;

      return arg.type === "FunctionExpression";
    })[0]);
  }

  return isWrappedFunction && functionPosition > 0;
};

module.exports = unwrapVisitor;

