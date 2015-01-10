"use strict";

/**
 * List of tasks to run when used as input transformer.
 *
 * @type {Array}
 */
exports.input = [
  //require("./visitors/imports"),
  //require("./visitors/exports"),

  //
  require("./visitors/unwrap-function"),

  // Parse `define(true);`.
  //require("./visitors/unwrap-literal"),

  // Parse `define();`.
  //require("./visitors/unwrap-undefined")
];

/**
 * List of tasks to run when used as output transformer.
 *
 * @type {Array}
 */
exports.output = [

];
