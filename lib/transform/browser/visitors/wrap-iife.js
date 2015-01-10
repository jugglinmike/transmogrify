"use strict";

var utils = require("jstransform/src/utils");

/**
 * Wraps source in an IIFE.
 *
 * @param {Function} traverse - Some kind of traversal method.
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 */
function exportsVisitor(traverse, node, path, state) {
  // Normalize to CJS global exports.
  utils.append("(function() {\n", state);

  var body = node.body;

  //state.g.position = node.body.body[0].range[1];

  // Trim remaining define.
  //utils.catchup(0, state);

  // Normalize to CJS global exports.
  utils.append("})();", state);
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
  return node.type === "Program";
};

module.exports = exportsVisitor;

