"use strict";

var Transform = require("../");

function ES6() {
  Transform.call(this);
}

ES6.prototype = Object.create(Transform.prototype);
ES6.prototype.import = require("./import");
//ES6.prototype.export = require("./export");
ES6.prototype.exports = require("./exports");

module.exports = ES6;
