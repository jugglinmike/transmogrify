var transmogrify = require("./");
var fs = require("fs");

["a"/*, "b", "c"*/].map(function(letter) {
  return {
    letter: letter,
    contents: fs.readFileSync("./" + letter + ".js").toString()
  };
}).forEach(function(obj) {
  var out = transmogrify(obj.contents, "amd", "browser");

  fs.writeFileSync("./cjs/" + obj.letter + ".js", out.code);
  fs.writeFileSync("./cjs/" + obj.letter + ".js.map", JSON.stringify(out.map, null, 2));
});
