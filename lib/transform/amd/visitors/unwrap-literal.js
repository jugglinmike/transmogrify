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
  var args = node.expression.arguments;

  // Normalize to CJS global exports.
  utils.append("module.exports = ", state);

  // Advance the position.
  state.g.position = literalReference.range[0];

  // Write the last literal value.
  utils.catchup(args[args.length - 1].range[1], state);

  // Finish with a semicolon.
  utils.append(";", state);

  // Trim remaining define.
  state.g.position = node.expression.range[1] + 1;
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
  var isWrappedLiteral = false;

  if (node.type === "ExpressionStatement") {
    isWrappedLiteral = unwrapVisitor.test(node.expression, path, state);
  }

  else if (node.type === "CallExpression" && node.callee.name === "define") {
    literalReference = node.arguments.filter(function(arg) {
      if (typeof arg.value === "string") {
        return false;
      }

      return ["ObjectExpression", "Literal"].indexOf(arg.type) > -1;
    })[0];

    // Determine if the reference exists.
    isWrappedLiteral = Boolean(literalReference);
  }

  return isWrappedLiteral;
};

module.exports = unwrapVisitor;
