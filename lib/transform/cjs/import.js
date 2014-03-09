module.exports = {
  identify: function(node) {
    if (node.type === "CallExpression" && node.callee.name === "require") {
      return node;
    }
  },

  extract: function(node) {
    return node.arguments[0].value;
  },

  write: function(node, moduleName) {
    node.update("require('" + moduleName + "')");
  }
};
