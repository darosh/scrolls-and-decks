/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="ResCount.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    function toSortedArray(o) {
        var k = 'total';
        var v = o[k];
        var a = [];
        _.each(v, function (vv, kk) {
            a.push([kk, vv]);
        });
        a.sort();
        o[k] = a;
    }
    ScrollsTypes.toSortedArray = toSortedArray;
    var ResCountSorted = (function () {
        function ResCountSorted(o, fix) {
            if (fix === void 0) { fix = false; }
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
        ResCountSorted.prototype.getLimits = function () {
            var m = 0;
            var l = 0;
            var n = Infinity;
            _.each(this.total, function (v, k) {
                var z = parseInt(k, 10) || 0;
                m = Math.max(m, z);
                l = Math.max(l, v);
                n = Math.min(n, z);
            });
            this.max = l;
            this.min = n;
            this.range = m;
        };
        ResCountSorted.prototype.fixRange = function () {
            var o = this;
            _.each(o, function (v) {
                if (!v || !_.isObject(v)) {
                    return;
                }
                for (var i = o.total['\u2014'] ? 1 : o.min; i <= o.range; i++) {
                    v[i] = v[i] || '';
                }
                if (o.total['\u2014']) {
                    v['\u2014'] = v['\u2014'] || '';
                }
            });
        };
        return ResCountSorted;
    })();
    ScrollsTypes.ResCountSorted = ResCountSorted;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=ResCountSorted.js.map