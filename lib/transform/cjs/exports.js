module.exports = {
  identify: function(node) {
    if (node.type === "Identifier" && node.name === "exports") {
      if (node.parent.type === "MemberExpression") {
        if (node.parent.object.name === "module") {
          return node.parent.parent;
        }
      }
    }
  },

  extract: function(node) {
    return node.right.name;
  },

  write: function(node, moduleName) {
    node.update("module.exports = " + moduleName);
  }
};
