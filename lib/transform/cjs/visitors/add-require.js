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
function addRequireVisitor(traverse, node, path, state) {
}

/**
 * test
 *
 * @param node
 * @param path
 * @param state
 * @return
 */
addRequireVisitor.test = function(node, path, state) {
  if (node.type === "CallExpression") {
    return node.callee.name === "require";
  }

  //console.log(state.deps);
};

module.exports = addRequireVisitor;
