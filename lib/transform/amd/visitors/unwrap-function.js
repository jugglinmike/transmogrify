"use strict";

var recast = require("recast");
var types = recast.types;
var builders = types.builders;

// The identifiers to look for.
var names = ["define", "require"];

module.exports = function(ast) {
  recast.types.visit(ast, {
    visitCallExpression: function(path) {
      var functionPosition = -1;

      if (names.indexOf(path.node.callee.name) > -1) {
        path.node.arguments.some(function(arg, i) {
          functionPosition = i;
          return arg.type === "FunctionExpression";
        });

        if (functionPosition > -1) {
          execute(path.node.arguments[functionPosition], path, ast);
        }
      }

      this.traverse(path);
    }
  });
};

function execute(node, path, ast) {
  ast.program.body = [];
  ast.program.body.push(builders.blockStatement(node.body));
}

/**
 * Unwraps an AMD module.
 *
 * @param {Function} traverse - Some kind of traversal method.
 * @param {Object} node - The current AST node.
 * @param {Array} path - The stack of paths up to this node.
 * @param {Object} state - A shared global and local state object.
 * @return
 */
//function unwrapVisitor(traverse, node, path, state) {
//  // Update to use the nested function body.
//  var body = functionReference.body.body[0];
//
//  // Advance the position.
//  state.g.position = body.range[0];
//
//  // Write the body buffer.
//  utils.catchup(body.range[1], state);
//
//  // Ignore the remaining function invocation `});\n`.
//  var endLength = body.range[1] + "});\n".length;
//  state.g.position = endLength;
//}
//
///**
// * Find all `define` function calls.
// *
// * @param {Object} node - The current AST node.
// * @param {Array} path - The stack of paths up to this node.
// * @param {Object} state - A shared global and local state object.
// * @return {boolean} Whether or not the node is a `define` function call.
// */
//unwrapVisitor.test = function(node, path, state) {
//  var isWrappedFunction = false;
//  var callee = node.callee;
//
//  if (node.type === "ExpressionStatement") {
//    isWrappedFunction = unwrapVisitor.test(node.expression, path, state);
//  }
//
//  else if (node.type === "CallExpression" && names.indexOf(callee.name) > -1) {
//    // Locate the function reference, if it exists.
//    functionReference = node.arguments.filter(function(arg, i) {
//      // Set the function position.
//      functionPosition = i;
//
//      return arg.type === "FunctionExpression";
//    })[0];
//
//    // Get the function contents body.
//    isWrappedFunction = Boolean(functionReference);
//  }
//
//  return isWrappedFunction;
//};
//
