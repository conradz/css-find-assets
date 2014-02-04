# css-find-assets

[![Build Status](https://drone.io/github.com/conradz/css-find-assets/status.png)](https://drone.io/github.com/conradz/css-find-assets/latest)

Find all assets referenced by a CSS AST by searching for properties using
`url(...)`.

## Example

```js
var find = require('css-find-assets'),
    parse = require('css-parse');

var tree = parse('.test { background-image: url("test.png"); }'),
    assets = find(tree);
console.log(assets);

// [
//   {
//     url: 'test.png',
//     node: { ... },
//     position: { index: 0, length: 15 }
//   }
// ]
```

## Reference

### `findAssets(tree)`

Finds all assets referenced by the CSS AST in `tree`. The AST must be in the
format that [css-parse](https://github.com/visionmedia/css-parse) generates.

Returns an array of objects that each have a `url` property that specifies the
URL referenced, a `node` property that contains a reference to the AST node
that references the asset, and a `position` property that specifies the
location in value that the reference was found.

The `position` object contains `index` and `length` properties that specify the
starting index and the length, respectively, of the `url(...)` call that
references the URL.
