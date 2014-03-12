module.exports = {
  identify: function(node) {
    return false;
  },

  extract: function(node) {
    return node.right.name;
  },

  write: function(node, moduleName) {
    node.update("module.exports = " + moduleName);
  }
};
