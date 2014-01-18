var falafel = require("falafel");
var assert = require("chai").assert;
var observableDiff = require("deep-diff").observableDiff;
var lib = require("..");

suite("define", function() {
  suite("Anonymous modules", function() {

    test("Anonymous module", function() {
      assert.equal(
        lib("define();"),
        ""
      );
    });

    suite("literal values", function() {
      test("object literal", function() {
        assert.equal(
          "define({});",
          "var __DEFINE__0__ = (function() { return {}; })();"
        );
      });

      test("boolean literal", function() {
        assert.equal(
          lib("define(true);"),
          "var __DEFINE__0__ = (function() { return true; })()"
        );
      });

      test("number literal", function() {
        assert.equal(
          lib("define(1234);"),
          "var __DEFINE__0__ = (function() { return 1234; })()"
        );
      });

      test("null", function() {
        assert.equal(
          lib("define(null);"),
          "var __DEFINE__0__ = (function() { return null; })()"
        );
      });

      test("undefined", function() {
        assert.equal(
          lib("define(undefined);"),
          "var __DEFINE__0__ = (function() { return undefined; })()"
        );
      });
    });

function bind(actual, expected, options) {
  var removeAttrs = options.removeAttrs || [];
  var varPattern = options.varPattern;
  // Lookup table of bound variable names
  var boundVars = {};

  function _bind(actual, expected) {
    var attr;

    // Literal values
    if (Object(actual) !== actual) {
      return;
    }

    // Arrays
    if (Array.isArray(actual)) {
      actual.forEach(function(_, i) {
        _bind(actual[i], expected[i]);
      });
      return;
    }

    // Objects

    // Update unbound variable names in the expected AST, using the
    // previously-bound value when available.
    if (actual.type === "Identifier") {
      if (varPattern.test(expected.name)) {
        if (!(expected.name in boundVars)) {
          boundVars[expected.name] = actual.name;
        }
        expected.name = boundVars[expected.name];
      }
    }

    // Either remove attributes or recurse on their values
    for (attr in actual) {
      if (removeAttrs.indexOf(attr) > -1) {
        delete actual[attr];
        delete expected[attr];
      } else {
        _bind(actual[attr], expected[attr]);
      }
    }
  }

  // Start recursing on the ASTs from the top level.
  _bind(actual, expected);
}

assert.astMatch = function(actualSrc, expectedSrc) {
  var actualAst;
  var expectedAst;

  // falafel preforms a pre-traversal walk, so the final node will be the
  // complete AST.
  falafel(actualSrc, false, function(node) {
    actualAst = node;
  });
  falafel(expectedSrc, false, function(node) {
    expectedAst = node;
  });

  bind(actualAst, expectedAst, {
    removeAttrs: ["line", "col", "pos"],
    varPattern: /__X\d+__/
  });

  assert.deepEqual(actualAst, expectedAst);
};

    suite("functions", function() {

      test.only("tautology", function() {
        assert.astMatch(
          lib("(function(a, b) { console.log(a + b); })(1, 3);"),
          "(function(__X13__,   __X0__)  {console.log(__X13__ + __X0__); }) (1,   3);"
        );
      });

      test("without dependencies", function() {
        assert.equal(
          lib("define(function() {});"),
          "var __DEFINE__0__ = (function() {})();"
        );
      });

      test("with AMD dependencies", function() {
        assert.equal(
          lib("define(['depA'], function(depA) {});"),
          "var __DEFINE__0__ = (function(depA) {})(depA);"
        );
      });

      test("with CJS dependencies", function() {
        var expected = [
          "(function() {",
            "var module = { exports: {} };",
            "(function(require, exports, module) {",
              "/* content */",
            "})(null, module.exports, module);",
          "});"
        ].join("");

        assert.equal(
          lib("define(function(require, exports, module) { /* content */ });"),
          expected
        );
      });
    });
  });

/*
  // Anonymous mixed dependencies and CJS.
  define(["require", "depA"], function(require, depA) {});

  // Named module.
  define("name");

  suite("Named module values.", function() {

    test("object literal", function() {
      assert.equal(
        lib("define('name', {});"),
        "var name = {};"
      );
    });


  define("name", true);
  define("name", 1234);
  define("name", null);
  define("name", undefined);
  });

  // Named function.
  define(function() {});

  // Named function with dependencies
  define("name", ["depA"], function(depA) {});

  // Named CJS.
  define("name", function(require, exports, module) {});

  // Named mixed dependencies and CJS.

  define("name", ["require", "depA"], function(require, depA) {});
*/
});
