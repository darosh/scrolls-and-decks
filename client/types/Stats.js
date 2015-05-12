/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="Card.ts" />
/// <reference path="ResCountSorted.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var Stats = (function () {
        function Stats(cards, all, full) {
            if (all === void 0) { all = false; }
            if (full === void 0) { full = false; }
            var total = new ScrollsTypes.ResCountTotal();
            var count = new ScrollsTypes.ResCount();
            var kind = new ScrollsTypes.ResCount();
            var rarity = new ScrollsTypes.ResCount();
            var type = new ScrollsTypes.ResCount();
            var trait = new ScrollsTypes.ResCount();
            var attack = new ScrollsTypes.ResCount();
            var counter = new ScrollsTypes.ResCount();
            var health = new ScrollsTypes.ResCount();
            cards.forEach(function (c) {
                var a = all ? c.c : 1;
                if (!c.s) {
                    return;
                }
                var r = c.s.growth ? 'g' : c.s.energy ? 'e' : c.s.order ? 'o' : 'd';
                var m = c.s.growth + c.s.energy + c.s.order + c.s.decay;
                count[r][m] = (count[r][m] || 0) + a;
                count.total[m] = (count.total[m] || 0) + a;
                total[r] = (total[r] || 0) + a;
                total.total = (total.total || 0) + a;
                kind[r][c.s.kind] = (kind[r][c.s.kind] || 0) + a;
                kind.total[c.s.kind] = (kind.total[c.s.kind] || 0) + a;
                rarity[r][c.s.rarity] = (rarity[r][c.s.rarity] || 0) + a;
                rarity.total[c.s.rarity] = (rarity.total[c.s.rarity] || 0) + a;
                c.s.typesArr.forEach(function (t) {
                    if (t) {
                        type[r][t] = (type[r][t] || 0) + a;
                        type.total[t] = (type.total[t] || 0) + a;
                    }
                });
                c.s.traits.forEach(function (t) {
                    if (t) {
                        trait[r][t] = (trait[r][t] || 0) + 1;
                        trait.total[t] = (trait.total[t] || 0) + 1;
                    }
                });
                if (c.s.kind === 'CREATURE' || c.s.kind === 'STRUCTURE') {
                    attack[r][c.s.ap] = (attack[r][c.s.ap] || 0) + 1;
                    attack.total[c.s.ap] = (attack.total[c.s.ap] || 0) + 1;
                    counter[r][c.s.ac] = (counter[r][c.s.ac] || 0) + 1;
                    counter.total[c.s.ac] = (counter.total[c.s.ac] || 0) + 1;
                    health[r][c.s.hp] = (health[r][c.s.hp] || 0) + 1;
                    health.total[c.s.hp] = (health.total[c.s.hp] || 0) + 1;
                }
            });
            var m = full ? 8 : parseInt(_.max(_.keys(count.total), function (v) {
                return parseInt(v, 10);
            }), 10);
            for (var i = 1; i <= m; i++) {
                count.g[i] = count.g[i] || '';
                count.e[i] = count.e[i] || '';
                count.o[i] = count.o[i] || '';
                count.d[i] = count.d[i] || '';
                count.total[i.toString()] = count.total[i];
            }
            this.max = _.max(count.total);
            this.resources = _.keys(total).length - 1;
            this.count = new ScrollsTypes.ResCountSorted(count);
            this.kind = new ScrollsTypes.ResCountSorted(kind);
            this.rarity = new ScrollsTypes.ResCountSorted(rarity);
            this.type = new ScrollsTypes.ResCountSorted(type);
            this.trait = new ScrollsTypes.ResCountSorted(trait);
            this.total = new ScrollsTypes.ResCountSorted(total);
            this.attack = new ScrollsTypes.ResCountSorted(attack, true);
            this.counter = new ScrollsTypes.ResCountSorted(counter, true);
            this.health = new ScrollsTypes.ResCountSorted(health, true);
            ScrollsTypes.toSortedArray(this.type);
            ScrollsTypes.toSortedArray(this.trait);
        }
        return Stats;
    })();
    ScrollsTypes.Stats = Stats;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Stats.js.map