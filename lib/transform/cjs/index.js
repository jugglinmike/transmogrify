"use strict";

var Transform = require("../");

function CommonJS() {
  Transform.call(this);
}

CommonJS.prototype = Object.create(Transform.prototype);
CommonJS.prototype.import = require("./import");
CommonJS.prototype.export = require("./export");
CommonJS.prototype.exports = require("./exports");

module.exports = CommonJS;
