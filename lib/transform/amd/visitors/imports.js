"use strict";

var utils = require("jstransform/src/utils");

/**
 * unwrap
 *
 * @param traverse
 * @param node
 * @param path
 * @param state
 * @return
 */
function importsVisitor(traverse, node, path, state) {
  // FIXME Extract into a global setup area.
  state.deps = state.deps || [];

  if (node.type === "CallExpression") {
    node.arguments.filter(function(node) {
      return node.type === "ArrayExpression"; 
    }).forEach(function(node) {
      state.deps.push.apply(state.deps, node.elements.map(function(node) {
        return node.value;
      }));
    });
  }
}

/**
 * test
 *
 * @param node
 * @param path
 * @param state
 * @return
 */
importsVisitor.test = function(node, path, state) {
  if (node.type === "CallExpression") {
    return ["require", "define"].indexOf(node.callee.name) > -1;
  }
};

module.exports = importsVisitor;
