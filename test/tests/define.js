var fs = require("fs");

var assert = require("../util/assert");
var transmogrify = require("../..");

// The browser transform is required for testing.
//transmogrify.transforms.browser = require("../transform/browser");

suite("define", function() {

  var fixturesDir = __dirname + "/../fixtures/define/";
  var testDirs = fs.readdirSync(fixturesDir);

  testDirs.filter(function(fileName) {
    return fileName !== "." || fileName !== "..";
  }).forEach(function(testDir) {
    suite(testDir, function() {
      var expected = fs.readFileSync(
        fixturesDir + testDir + "/expected.js"
      ).toString();

      test("anonymous module", function() {
        var inputAnon = fs.readFileSync(
          fixturesDir + testDir + "/input-anon.js"
        ).toString();

        var actual = transmogrify(inputAnon, "amd", "browser").source;

        assert.astMatch(actual, expected);
      });

      test.skip("named module", function() {
        var inputNamed = fs.readFileSync(
          fixturesDir + testDir + "/input-named.js"
        ).toString();

        var actual = transmogrify(inputNamed, "amd", "browser").source;

        assert.astMatch(actual, expected);
      });
    });
  });

});
