module.exports = {
  identify: function(node) {
    if (node.type === "Identifier" && node.name === "exports") {
      return node.parent.parent;
    }
  },

  extract: function(node) {
    return {
      property: node.left.property.name,
      value: node.right.name
    };
  },

  write: function(node, property, value) {
    node.update("exports." + property + " = " + value);
  }
};
