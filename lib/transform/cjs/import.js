module.exports = {
  identify: function(node) {
    return node.type === "CallExpression" && node.callee.name === "require";
  },

  extract: function(node) {
    return node.arguments[0].value;
  },

  write: function(node, moduleName) {
    node.update("require('" + moduleName + "')");
  }
};
