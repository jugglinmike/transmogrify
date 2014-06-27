var fs = require("fs");

var assert = require("../util/assert");
var transmogrify = require("../..");

suite("require", function() {

  var fixturesDir = __dirname + "/../fixtures/require/";
  var testDirs = fs.readdirSync(fixturesDir);

  testDirs.filter(function(fileName) {
    return fileName !== "." || fileName !== "..";
  }).forEach(function(testDir) {
    test.skip(testDir, function() {
      var input = fs.readFileSync(
        fixturesDir + testDir + "/input.js"
      ).toString();
      var expected = fs.readFileSync(
        fixturesDir + testDir + "/expected.js"
      ).toString();

      var actual = transmogrify(input, "amd", "browser").source;

      assert.astMatch(actual, expected);
    });
  });
});
