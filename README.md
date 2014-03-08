# Transmogrify

> Translate JavaScript module formats

[![Build Status](https://travis-ci.org/jugglinmike/transmogrify.png)](https://travis-ci.org/jugglinmike/transmogrify)

## Example

Given a strictly-defined JavaScript module like:

``` javascript
define("moduleA", [], function() {

});
```

This library can infer the module format translate the source into another
output format:

``` javascript
// Get the source and convert to a String.
var source = fs.readFileSync("./the/above/file").toString();

// Pass into the `clean` function, you will receive cleaned source of the file.
var browser = require("transmogrify")(source, "browser");
```

By default, the transmogrification defines all modules on the global scope.

``` javascript
window.moduleA = (function() {

})();
```

## Module Format Support

Currently implemented:

- (none)

Planned:

- [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api)
- [Common JS](http://wiki.commonjs.org/wiki/Modules)
- [ECMAScript 6](http://wiki.ecmascript.org/doku.php?id=harmony:modules)
- Synchronous browser global definition (output only)

## Tests

Unit tests can be invoked from the command line via:

``` bash
npm test
```

The tests assert expectations over JavaScript ASTs. See [the "compareAst"
project](https://github.com/jugglinmike/compare-ast) for details.

## Documentation

At the moment there are no pubished resources for API documentation, but fear
not, you can generate the API documentation by running:

``` bash
npm run jsdoc
```

Once that completes you can open **docs/index.html** in your browser.

## License

Copyright (c) 2014 Tim Branyen & Mike Pennisi  
Licensed under the MIT license.
