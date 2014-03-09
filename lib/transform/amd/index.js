"use strict";

var Transform = require("../");

function AMD() {
  Transform.call(this);
}

AMD.prototype = Object.create(Transform.prototype);
AMD.prototype.import = require("./import");
//AMD.prototype.export = require("./export");
//AMD.prototype.exports = require("./exports");

module.exports = AMD;
