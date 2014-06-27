"use strict";

var utils = require("jstransform/src/utils");

var returnReference = null;

/**
 * Normalizes module exports.
 *
 * @param {Function} traverse - Some kind of traversal method.
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return
 */
function exportsVisitor(traverse, node, path, state) {
  // Normalize to CJS global exports.
  utils.append("module.exports = ", state);

  // Advance the position.
  state.g.position = returnReference.argument.range[0];

  // Write the last literal value.
  utils.catchup(returnReference.range[1], state);

  // Trim remaining define.
  state.g.position = node.range[1] + 1;
}

/**
 * Find all `define` function calls.
 *
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return {boolean} Whether or not the node is a `define` function call.
 */
exportsVisitor.test = function(node, path, state) {
  var functionReference = null;
  var hasReturn = false;

  if (node.type === "ExpressionStatement") {
    hasReturn = exportsVisitor.test(node.expression, path, state);
  }

  else if (node.type === "CallExpression" && node.callee.name === "define") {
    // Locate the function reference, if it exists.
    functionReference = node.arguments.filter(function(arg, i) {
      return arg.type === "FunctionExpression";
    })[0];

    returnReference = functionReference.body.body.filter(function(arg, i) {
      return arg.type === "ReturnStatement";
    })[0];

    hasReturn = Boolean(returnReference);
  }

  return hasReturn;
};

module.exports = exportsVisitor;
