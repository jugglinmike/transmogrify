"use strict";

var parse = require("falafel-harmony");
var SourceNode = require("source-map").SourceNode;

function Transform() {
  this.parserSettings = { loc: true };
}

Transform.prototype.traverseNodeList = function(nodeList, callback) {
  var transform = this;

  nodeList.forEach(function(node) {
    node.moduleNames.forEach(function(moduleName) {
      callback.call(transform, node, moduleName);
    });
  });
};

Transform.prototype.patchNode = function(node, chunks) {
  var update = node.update;

  node.update = function(newContent) {
    var line = this.loc.start.line;
    var column = this.loc.start.column;
    var oldContent = this.source();

    chunks[node.range[0]] = new SourceNode(line, column, "in.js", [newContent]);

    for (var i = node.range[0] + 1; i < node.range[1]; i++) {
      chunks[i] = '';
    }

    // Transparently send back the original.
    return update.apply(this, arguments);
  };

  return node;
};

Transform.prototype.deconstruct = function(source) {
  var moduleDescriptor = {};
  var transform = this;
  var imports = [];
  var exports = {
    default: [],
    named: []
  };
  var lastNode;
  var chunks = source.split("");

  var ast = parse(source, this.parserSettings, function(node) {
    node = transform.patchNode(node, chunks);
    var transformNode;

    lastNode = node;

    // Identify all top level dependency nodes.
    if (transformNode = transform.import.identify(node)) {
      imports.push(transformNode);
    }

    // Find all default exports.
    if (transformNode = transform.exports.identify(node)) {
      exports.default.push(transformNode);
    }

    // Find all single exports.
    if (transformNode = transform.export.identify(node)) {
      exports.named.push(transformNode);
    }
  });

  // The root node, by default, is the program node.
  moduleDescriptor.rootNode = lastNode;

  // Assign chunks.
  moduleDescriptor.chunks = chunks;

  moduleDescriptor.originalSource = source;

  // Iterate over the dependency nodes and extract the valid
  // meta-information.
  moduleDescriptor.imports = imports.map(function(node) {
    // Decorate the import node.
    node.moduleNames = [].concat(transform.import.extract(node));

    return node;
  });

  moduleDescriptor.exports = exports.default.map(function(node) {
    node.moduleNames = [].concat(transform.exports.extract(node));

    return node;
  });

  moduleDescriptor.namedExports = exports.named.map(function(node) {
    node.moduleNames = [].concat(transform.export.extract(node));

    return node;
  });

  // Attach the AST for sharing.
  moduleDescriptor.ast = ast;

  return moduleDescriptor;
};

Transform.prototype.reconstruct = function(moduleDescriptor) {
  this.traverseNodeList(moduleDescriptor.imports, function(node, moduleName) {
    this.import.write(node, moduleName);
  });

  this.traverseNodeList(moduleDescriptor.exports, function(node, moduleName) {
    this.exports.write(node, moduleName);
  });

  this.traverseNodeList(moduleDescriptor.namedExports, function(node, assignment) {
    this.export.write(node, assignment.property, assignment.value);
  });

  if (this.import.beforeComplete) {
    this.import.beforeComplete.call(this, moduleDescriptor);
  }

  // Generate the parent Source Map.
  var root = new SourceNode(null, null, null, moduleDescriptor.chunks);

  // Add the content.
  root.setSourceContent("in.js", moduleDescriptor.originalSource);

  var sm = root.toStringWithSourceMap({ file: "out.js" });

  var sourceMap = moduleDescriptor.sourceMap = sm.map.toString();

  // Remove the excessive escaping.
  sourceMap = sourceMap.replace(/\\\\/g, "\\");

  // Trim off the final newline.
  moduleDescriptor.sourceMap = sourceMap;

  return moduleDescriptor.ast.toString();
};

module.exports = Transform;
