"use strict";

module.exports = {
  identify: function(node) {
    return false;
  },

  extract: function(node) {

  },

  write: function(node, moduleName) {

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
