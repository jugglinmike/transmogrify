"use strict";

module.exports = {
  identify: function(node) {
    if (node.type === "CallExpression") {
      if (node.callee.name === "define") {
        return node;
      }
    }
  },

  extract: function(node) {
    // Empty defines can be removed.
    if (node.arguments.length === 0) {
      node.update("");
    }

    // Literal anonymous defines.
    if (node.arguments.length === 1) {
      // Object defines.
      if (node.arguments[0].type === "ObjectExpression") {
        return {
          property: null,
          value: node.arguments[0].source()
        };
      }
    }

    //if (node.arguments[0]

    // Find defines in the arguments.

    // Find any defines inside the
  },

  write: function() {

  },

  beforeComplete: function() {
    //var root = moduleDescriptor.rootNode;
    //var seen = [];

    //this.traverseImports(moduleDescriptor, function(node, moduleName) {
    //  // Prevent duplicate module imports.
    //  if (seen.indexOf(moduleName) === -1) {
    //    root.update([
    //      "import '" + moduleName + "';",
    //      root.source()
    //    ].join("\n"));

    //    seen.push(moduleName);
    //  }
    //});
  }
};
