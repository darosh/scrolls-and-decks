/// <reference path="Scroll.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var Scrolls = (function () {
        function Scrolls(data, webp) {
            var _this = this;
            if (webp === void 0) { webp = false; }
            this.parsed = [];
            this.look = {};
            this.kinds = {};
            this.types = {};
            this.modified = new Date(data.modified);
            this.version = data.version;
            Scrolls.initResources(this.kinds);
            Scrolls.initResources(this.types);
            data.types.forEach(function (type) {
                var s = new ScrollsTypes.Scroll(type, data, webp);
                _this.parsed.push(s);
                _this.look[s.id] = s;
                _this.kinds[s.r][s.kind] = _this.kinds[s.r][s.kind] || [];
                _this.kinds[s.r][s.kind].push(s);
                s.typesArr.forEach(function (t) {
                    _this.types[s.r][t] = _this.types[s.r][t] || [];
                    _this.types[s.r][t].push(s);
                });
            });
        }
        Scrolls.initResources = function (o) {
            o[ScrollsTypes.Resource[0 /* g */]] = {};
            o[ScrollsTypes.Resource[1 /* e */]] = {};
            o[ScrollsTypes.Resource[2 /* o */]] = {};
            o[ScrollsTypes.Resource[3 /* d */]] = {};
        };
        return Scrolls;
    })();
    ScrollsTypes.Scrolls = Scrolls;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Scrolls.js.map