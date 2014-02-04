module.exports = find;

function find(tree) {
    if (tree.stylesheet) {
        return find(tree.stylesheet);
    }

    var styles = tree,
        assets = [];

    if (styles.declarations) {
        styles.declarations.forEach(function(d) {
            var pattern = /url\(['"]([^'"]+)['"]\)/g,
                m;
            while ((m = pattern.exec(d.value)) !== null) {
                assets.push({
                    url: m[1],
                    node: d,
                    position: {
                        index: m.index,
                        length: m[0].length
                    }
                });
            }
        });
    }

    if (styles.rules) {
        styles.rules.forEach(function(rule) {
            assets = assets.concat(find(rule));
        });
    }

    return assets;
}
