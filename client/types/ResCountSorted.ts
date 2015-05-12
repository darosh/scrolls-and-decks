/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="ResCount.ts" />

module ScrollsTypes {
    'use strict';

    export function toSortedArray(o:any):void {
        var k:string = 'total';
        var v:any = o[k];
        var a:any[] = [];

        _.each(v, function (vv:any, kk:any):void {
            a.push([kk, vv]);
        });

        a.sort();
        o[k] = a;
    }

    export class ResCountSorted {
        r0:{};
        r1:{};
        r2:{};
        r3:{};
        total:{};
        max:number;
        min:number;
        range:number;

        constructor(o:ResCount|ResCountTotal, fix:boolean = false) {
            this.r0 = o.g;
            this.r1 = o.e;
            this.r2 = o.o;
            this.r3 = o.d;
            this.total = o.total;

            if (fix) {
                this.getLimits();
                this.fixRange();
            }
        }

        getLimits():void {
            var m:number = 0;
            var l:number = 0;
            var n:number = Infinity;

            _.each(this.total, function (v:number, k:string):void {
                var z:number = parseInt(k, 10) || 0;
                m = Math.max(m, z);
                l = Math.max(l, v);
                n = Math.min(n, z);
            });

            this.max = l;
            this.min = n;
            this.range = m;
        }

        fixRange():void {
            var o:any = this;

            _.each(o, function (v:any):void {
                if (!v || !_.isObject(v)) {
                    return;
                }

                for (var i:number = o.total['\u2014'] ? 1 : o.min; i <= o.range; i++) {
                    v[i] = v[i] || '';
                }

                if (o.total['\u2014']) {
                    v['\u2014'] = v['\u2014'] || '';
                }
            });
        }
    }
}
