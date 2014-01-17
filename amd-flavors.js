// Anonymous object.
define({});

// Anonymous function.
define(function() {});

// Anonymous function with dependencies.
define(["depA"], function(depA) {});

// Anonymous CJS.
define(function(require, exports, module) {});

// Anonymous mixed dependencies and CJS.
define(["require", "depA"], function(require, depA) {});

// Named module.
define("name");

// Named function.
define(function() {});

// Named function with dependencies
define("name", ["depA"], function(depA) {});

// Named CJS.
define("name", function(require, exports, module) {});

// Named mixed dependencies and CJS.
define("name", ["require", "depA"], function(require, depA) {});