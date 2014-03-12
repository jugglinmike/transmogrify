module.exports = {
  identify: function(node) {
    if (node.type === "ExportDeclaration") {
      return node;
    }
  },

  extract: function(node) {
    var index = node.parent.body.indexOf(node);
    var prev = node.parent.body[index + 1];

    // Remove the existing identifier.
    prev.update("");

    return prev.expression.name;
  },

  write: function(node, moduleName) {
    node.update("export default " + moduleName);
  }
};
