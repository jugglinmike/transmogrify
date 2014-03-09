"use strict";

module.exports = {
  identify: function(node) {
    return node.type === "ImportDeclaration";
  },

  extract: function(node) {
    return node.specifiers.map(function(specifier) {
      return specifier.id.name;
    });
  },

  write: function(node, moduleName) {
    node.update("System.get('" + moduleName + "')");
  },

  beforeComplete: function(moduleDescriptor) {
    var root = moduleDescriptor.rootNode;
    var seen = [];

    this.traverseImports(moduleDescriptor, function(node, moduleName) {
      // Prevent duplicate module imports.
      if (seen.indexOf(moduleName) === -1) {
        root.update([
          "import '" + moduleName + "';",
          root.source()
        ].join("\n"));

        seen.push(moduleName);
      }
    });
  }
};
