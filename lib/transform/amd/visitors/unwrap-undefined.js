"use strict";

var utils = require("jstransform/src/utils");

var literalReference = null;

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
  // Normalize to CJS global exports.
  utils.append("undefined;", state);

  // Advance the position.
  state.g.position = node.range[1];
  utils.catchup(0, state);
}

/**
 * Find all `define` literal calls.
 *
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return {boolean} Whether or not the node is a `define` function call.
 */
unwrapVisitor.test = function(node, path, state) {
  var isEmpty = false;

  if (node.type === "ExpressionStatement") {
    isEmpty = unwrapVisitor.test(node.expression, path, state);
  }

  else if (node.type === "CallExpression" && node.callee.name === "define") {
    var args = node.arguments;

    if (args.length === 0) {
      isEmpty = true;
    }
    else if (args === 1 && typeof args[0].value === "string") {
      isEmpty = true;
    }
  }

  return isEmpty;
};

module.exports = unwrapVisitor;
