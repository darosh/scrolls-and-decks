/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="Card.ts" />
/// <reference path="ResCountSorted.ts" />

module ScrollsTypes {
    'use strict';

    export class Stats {
        total:{};
        count:ResCountSorted;
        kind:ResCountSorted;
        rarity:ResCountSorted;
        type:ResCountSorted;
        trait:ResCountSorted;
        attack:ResCountSorted;
        counter:ResCountSorted;
        health:ResCountSorted;
        max:number|string;
        resources:number;

        constructor(cards:Card[], all:boolean = false, full:boolean = false) {
            var total:ResCountTotal = new ResCountTotal();
            var count:ResCount = new ResCount();
            var kind:ResCount = new ResCount();
            var rarity:ResCount = new ResCount();
            var type:ResCount = new ResCount();
            var trait:ResCount = new ResCount();
            var attack:ResCount = new ResCount();
            var counter:ResCount = new ResCount();
            var health:ResCount = new ResCount();


            cards.forEach(function (c:Card):void {
                var a:number = all ? c.c : 1;

                if (!c.s) {
                    return;
                }

                var r:string = c.s.growth ? 'g' : c.s.energy ? 'e' : c.s.order ? 'o' : 'd';
                var m:number = c.s.growth + c.s.energy + c.s.order + c.s.decay;

                count[r][m] = (count[r][m] || 0) + a;
                count.total[m] = (count.total[m] || 0) + a;

                total[r] = (total[r] || 0) + a;
                total.total = (total.total || 0) + a;

                kind[r][c.s.kind] = (kind[r][c.s.kind] || 0) + a;
                kind.total[c.s.kind] = (kind.total[c.s.kind] || 0) + a;

                rarity[r][c.s.rarity] = (rarity[r][c.s.rarity] || 0) + a;
                rarity.total[c.s.rarity] = (rarity.total[c.s.rarity] || 0) + a;

                c.s.typesArr.forEach(function (t:string):void {
                    if (t) {
                        type[r][t] = (type[r][t] || 0) + a;
                        type.total[t] = (type.total[t] || 0) + a;
                    }
                });

                c.s.traits.forEach(function (t:string):void {
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

            var m:number = full ? 8 : parseInt(_.max(_.keys(count.total), function (v:string):number {
                return parseInt(v, 10);
            }), 10);

            for (var i:number = 1; i <= m; i++) {
                count.g[i] = count.g[i] || '';
                count.e[i] = count.e[i] || '';
                count.o[i] = count.o[i] || '';
                count.d[i] = count.d[i] || '';
                count.total[i.toString()] = count.total[i];
            }

            this.max = _.max(count.total);
            this.resources = _.keys(total).length - 1;

            this.count = new ResCountSorted(count);
            this.kind = new ResCountSorted(kind);
            this.rarity = new ResCountSorted(rarity);
            this.type = new ResCountSorted(type);
            this.trait = new ResCountSorted(trait);
            this.total = new ResCountSorted(total);
            this.attack = new ResCountSorted(attack, true);
            this.counter = new ResCountSorted(counter, true);
            this.health = new ResCountSorted(health, true);

            toSortedArray(this.type);
            toSortedArray(this.trait);
        }
    }
}
