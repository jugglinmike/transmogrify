"use strict";

function transmogrify(inputSource, input, output) {
  var inputTransform = new transmogrify.transforms[input]();
  var outputTransform = new transmogrify.transforms[output]();

  var moduleDescriptor = inputTransform.deconstruct(inputSource);
  var outputSource = outputTransform.reconstruct(moduleDescriptor);

  return { sourceMap: moduleDescriptor.sourceMap, source: outputSource };
}

transmogrify.transforms = {};

transmogrify.transforms.cjs = require("./transform/cjs");
transmogrify.transforms.es6 = require("./transform/es6");
transmogrify.transforms.amd = require("./transform/amd");

module.exports = transmogrify;
