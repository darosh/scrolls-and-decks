/// <reference path="../../typings/lodash/lodash.d.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    (function (Resource) {
        Resource[Resource["g"] = 0] = "g";
        Resource[Resource["e"] = 1] = "e";
        Resource[Resource["o"] = 2] = "o";
        Resource[Resource["d"] = 3] = "d";
    })(ScrollsTypes.Resource || (ScrollsTypes.Resource = {}));
    var Resource = ScrollsTypes.Resource;
    (function (Rarity) {
        Rarity[Rarity["Common"] = 0] = "Common";
        Rarity[Rarity["Uncommon"] = 1] = "Uncommon";
        Rarity[Rarity["Rare"] = 2] = "Rare";
    })(ScrollsTypes.Rarity || (ScrollsTypes.Rarity = {}));
    var Rarity = ScrollsTypes.Rarity;
    function html(t, noBreak) {
        if (noBreak === void 0) { noBreak = false; }
        return t && t.replace(/\\n/g, '\n').trim().replace(/\.\.\./g, '&hellip;').replace(/(<[^>]+)\\n([^>]+>)/g, '$1 $2').replace(/\[([^\]]+)]/g, '<b>$1<\/b>').replace(/\.\n/g, '.<br />').replace(/\n/g, noBreak ? ' ' : '<br />');
    }
    function htmlFlavor(t) {
        return t && t.replace(/"([^"]+)"/g, '&ldquo;$1&rdquo;').replace(/-/g, '&mdash;');
    }
    function scrollLink(t, types) {
        return t && t.replace(/<([^>]+)>/g, function (match, group) {
            var g = group.replace(/\\n/g, ' ');
            var id = _.find(types, function (v) {
                return g.indexOf(v.name) === 0;
            }).id;
            return '<a href="./#/scroll/' + id + '">' + g + '</a>';
        });
    }
    function noScrollLink(t) {
        return t && t.replace(/<([^>]+)>/g, '<b>$1<\/b>');
    }
    function trait(v) {
        var tr = /^[^:\d]+/;
        var m = v[0].match(tr);
        var r = m[0].trim();
        return r[0].toUpperCase() + r.substr(1);
    }
    function getTerms(text) {
        var r = {};
        var rx = /\[([^\]]+)]/g;
        var match = rx.exec(text);
        while (match !== null) {
            r[match[1].toLowerCase()] = true;
            match = rx.exec(text);
        }
        return r;
    }
    function traitLink(v) {
        if (!v.match) {
            return v;
        }
        var tr = /^[^:\d]+/;
        var m = v.match(tr);
        var r = _.trim(m[0]);
        var l = r[0].toUpperCase() + r.substr(1).toLowerCase();
        var x = new RegExp('^' + r);
        return [r, l, v.replace(x, '')];
    }
    var Scroll = (function () {
        function Scroll(v, data, webp) {
            if (webp === void 0) { webp = false; }
            this.decks = {};
            this.decksCount = 0;
            var typesArr = v.types.split(',');
            typesArr = (typesArr.length && !typesArr[0]) ? [] : typesArr;
            v.img = v.img || '';
            this.id = v.id;
            this.name = v.name;
            this.nameLowerCase = v.name.toLowerCase();
            this.flavor = htmlFlavor(html(v.flavor));
            this.description = html(noScrollLink(v.desc), true);
            this.descriptionLink = html(scrollLink(v.desc, data.types), true);
            this.rarity = v.rarity;
            this.rarityText = Rarity[v.rarity];
            this.kind = v.kind;
            this.types = typesArr.join(', ');
            this.typesArr = typesArr;
            this.energy = v.energy;
            this.growth = v.growth;
            this.order = v.order;
            this.decay = v.decay;
            this.cost = v.growth + v.energy + v.order + v.decay;
            this.ri = v.growth ? 0 /* g */ : v.energy ? 1 /* e */ : v.order ? 2 /* o */ : 3 /* d */;
            this.r = Resource[this.ri];
            this.ap = v.ap;
            this.ac = v.ac;
            this.hp = v.hp;
            this.hp = v.hp;
            this.set = v.set;
            this.price = v.price || 0;
            this.L = '0px ' + (-144 * v.img - 1) + 'px';
            this.M = '0px ' + (-63 * v.img - 1) + 'px';
            this.S = '-10px ' + (-48 * v.img - 1) + 'px';
            this.Lc = (webp ? 'app-art-webp-' : 'app-art-') + 'l-' + this.r;
            this.Mc = (webp ? 'app-art-webp-' : 'app-art-') + 'm-' + this.r;
            this.Sc = (webp ? 'app-art-webp-' : 'app-art-') + 's-' + this.r;
            this.bundle = v.bundle;
            this.traits = v.rules.map(trait);
            this.rules = v.rules.map(function (p) {
                return {
                    name: html(p[0])
                };
            });
            var t = getTerms(v.desc);
            var terms = {};
            _.each(t, function (v, k) {
                if (data.strings[k]) {
                    terms[k] = data.strings[k];
                }
            });
            var tr = getTerms(v.rules);
            _.each(tr, function (v, k) {
                if (data.strings[k]) {
                    terms[k] = data.strings[k];
                }
            });
            _.each(v.rules, function (v) {
                if (v) {
                    terms[v[0].toLowerCase()] = v;
                    v[0] = html(v[0]);
                    if (v[1].indexOf('${AMOUNT}') > -1) {
                        var e = /^[^\d]+(\d)/.exec(v[0]);
                        v[1] = v[1].replace('${AMOUNT}', (e && e[1]) || 'amount');
                    }
                }
            });
            this.terms = _.pairs(terms);
            this.traits = _.uniq(this.traits.concat(_.map(this.terms, trait)));
            _.each(this.terms, function (v) {
                v[1][0] = traitLink(v[1][0]);
            });
            this.p = (this.ap !== 0) || (this.ac !== 0) || (this.hp !== 0);
            this.ac = (this.ac === -1) ? '\u2014' : this.ac;
        }
        Scroll.prototype.updateDecksCount = function () {
            this.decksCount = _.keys(this.decks).length;
        };
        return Scroll;
    })();
    ScrollsTypes.Scroll = Scroll;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Scroll.js.map