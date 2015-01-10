//define();

define('a', ["./b"], function(b) {
  return {};
});


//define([
//  "./a",
//  "./b"
//], function(a, b) {
//  console.log("here");
//});
//
//require([
//  "./a",
//  "./b"
//], function() {
//  console.log("yay!");
//});
