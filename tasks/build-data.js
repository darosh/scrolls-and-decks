var fs = require('fs');
var path = require('path');
var mkp = require('mkdirp');

module.exports = function (cardTypes, mappedStrings, prices, server, date, imgSrc, imgTgt) {
    var r = [];
    var s = {};
    var is = {g: [], e: [], o: [], d: []};
    var ts = {};

    mkp.sync(imgTgt + '/g');
    mkp.sync(imgTgt + '/e');
    mkp.sync(imgTgt + '/o');
    mkp.sync(imgTgt + '/d');

    prices.available.forEach(function (v) {
        if (!ts[v.type]) {
            ts[v.type] = v.price;
        } else {
            ts[v.type] = Math.min(v.price, ts[v.type]);
        }
    });

    cardTypes.cardTypes.forEach(function (v) {
        var im = v.cardImage + '.png';
        var rules = [];

        if (v.passiveRules) {
            v.passiveRules.forEach(function (w) {
                rules.push([w.displayName, w.description]);
            });
        }

        var n = {
            id: v.id,
            name: v.name,
            desc: v.description,
            flavor: v.flavor,
            kind: v.kind,
            types: v.subTypesStr,
            rarity: v.rarity,
            hp: v.hp,
            ap: v.ap,
            ac: v.ac,
            growth: v.costGrowth,
            energy: v.costEnergy,
            order: v.costOrder,
            decay: v.costDecay,
            set: v.set,
            rules: rules,
            img: im,
            price: ts[v.id],
            bundle: v.animationBundle
        };

        var res = n.growth ? 'g' : n.energy ? 'e' : n.order ? 'o' : 'd';
        is[res].push(im);
        n.res = res;

        r.push(n);
    });

    is.g.sort();
    is.e.sort();
    is.o.sort();
    is.d.sort();

    r.forEach(function (v) {
        fs.createReadStream(path.join(imgSrc, v.img)).pipe(fs.createWriteStream(path.join(imgTgt, v.res, v.img)));
        v.img = is[v.res].indexOf(v.img);
        delete v.res;
    });

    mappedStrings.strings.forEach(function (v) {
        s[v.key.toLowerCase()] = [v.key, v.value];
    });

    return ({
        types: r,
        strings: s,
        modified: date.toJSON(),
        version: server.version
    });
};
