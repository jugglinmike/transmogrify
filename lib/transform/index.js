"use strict";

var parse = require("falafel");

function Transform() {
  this.parserSettings = { loc: true };
}

Transform.prototype.traverseImports = function(moduleDescriptor, callback) {
  var transform = this;

  moduleDescriptor.imports.forEach(function(node) {
    node.moduleNames.forEach(function(moduleName) {
      callback.call(transform, node, moduleName);
    });
  });
};

Transform.prototype.deconstruct = function(source) {
  var moduleDescriptor = {};
  var transform = this;
  var imports = [];
  var lastNode;

  // Identify all top level dependency nodes.
  var ast = parse(source, this.parserSettings, function(node) {
    lastNode = node;

    if (transform.import.identify(node)) {
      imports.push(node);
    }
  });

  // The root node, by default, is the program node.
  moduleDescriptor.rootNode = lastNode;

  // Iterate over the dependency nodes and extract the valid
  // meta-information.
  moduleDescriptor.imports = imports.map(function(node) {
    // Decorate the import node.
    node.moduleNames = [].concat(transform.import.extract(node));

    return node;
  });

  // Attach the AST for sharing.
  moduleDescriptor.ast = ast;

  return moduleDescriptor;
};

Transform.prototype.reconstruct = function(moduleDescriptor) {
  this.traverseImports(moduleDescriptor, function(node, moduleName) {
    this.import.write(node, moduleName);
  });

  if (this.import.beforeComplete) {
    this.import.beforeComplete.call(this, moduleDescriptor);
  }

  return moduleDescriptor.ast.toString();
};

module.exports = Transform;
