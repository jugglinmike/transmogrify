module.exports = {
  identify: function() {
    return false;
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
