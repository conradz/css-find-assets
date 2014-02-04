var test = require('tap').test,
    parse = require('css-parse'),
    find = require('./');

test('find asset referenced by a property', function(t) {
    var tree = parse('.test { background-image: url("test.png"); }'),
        results = find(tree),
        node = tree.stylesheet.rules[0].declarations[0];
    t.deepEqual(results, [
        { url: 'test.png', node: node, position: { index: 0, length: 15 } }
    ]);

    t.end();
});

test('find multiple assets', function(t) {
    var tree = parse(
        '.test { background-image: url("foo.png"); }' +
        '.test { background-image: url("bar.png"); }');

    var results = find(tree),
        node1 = tree.stylesheet.rules[0].declarations[0],
        node2 = tree.stylesheet.rules[1].declarations[0];
    t.deepEqual(results, [
        { url: 'foo.png', node: node1, position: { index: 0, length: 14 } },
        { url: 'bar.png', node: node2, position: { index: 0, length: 14 } }
    ]);

    t.end();
});

test('find asset referenced in @font-face', function(t) {
    var tree = parse('@font-face { src: url("../my-font.woff"); }'),
        results = find(tree),
        node = tree.stylesheet.rules[0].declarations[0];
    t.deepEqual(results, [
        { url: '../my-font.woff', node: node, position: { index: 0, length: 22 } }
    ]);

    t.end();
});

test('find assets in comma-separated property', function(t) {
    var tree = parse(
        '.image { background-image: url("foo.png"), url("bar.png"); }');

    var results = find(tree),
        node = tree.stylesheet.rules[0].declarations[0];
    t.deepEqual(results, [
        { url: 'foo.png', node: node, position: { index: 0, length: 14 } },
        { url: 'bar.png', node: node, position: { index: 16, length: 14 } }
    ]);

    t.end();
});

test('find assets in space-separated property', function(t) {
    var tree = parse('.test { background: url("foo.png") url("bar.png"); }'),
        results = find(tree),
        node = tree.stylesheet.rules[0].declarations[0];
    t.deepEqual(results, [
        { url: 'foo.png', node: node, position: { index: 0, length: 14 } },
        { url: 'bar.png', node: node, position: { index: 15, length: 14 } }
    ]);

    t.end();
});

test('find assets in @media blocks', function(t) {
    var tree = parse(
        '@media (min-width: 640px) {' +
        '  .test { background-image: url("large.png"); }' +
        '}');

    var results = find(tree),
        node = tree.stylesheet.rules[0].rules[0].declarations[0];
    t.deepEqual(results, [
        { url: 'large.png', node: node, position: { index: 0, length: 16 } }
    ]);

    t.end();
});
