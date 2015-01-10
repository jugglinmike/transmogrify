"use strict";

var recast = require("recast");

/**
 * Normalizes module exports.
 *
 * @param {Function} traverse - Some kind of traversal method.
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return
 */
function exportsVisitor(ast) {
  recast.types.visit(ast, {
    visitCallExpression: exportsVisitor.visit
  });

//  // Normalize to CJS global exports.
//  utils.append("module.exports = ", state);
//
//  // Advance the position.
//  state.g.position = returnReference.argument.range[0];
//
//  // Write the last literal value.
//  utils.catchup(returnReference.range[1], state);
//
//  // Trim remaining define.
//  state.g.position = node.range[1] + 1;
}

/**
 * Find all `define` function calls.
 *
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return {boolean} Whether or not the node is a `define` function call.
 */
exportsVisitor.visit = function(path) {
  if (path.node.callee.name !== "define") { return; }

  // Locate the function reference, if it exists.
  var functionReference = path.node.arguments.filter(function(arg, i) {
    return arg.type === "FunctionExpression";
  })[0];

  var returnReference = null;
  var index = 0;

  // If there is a function, find the ReturnStatement, if it exists.
  if (functionReference) {
    returnReference = functionReference.body.body.filter(function(arg, i) {
      index = i;
      return arg.type === "ReturnStatement";
    })[0];
  }

  if (returnReference) {
    // Remove the reference.
    functionReference.body = recast.types.builders.emptyStatement();
  }

  this.traverse(path);
};

module.exports = exportsVisitor;
