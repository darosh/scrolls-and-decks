(function () {
    'use strict';

    function Recent($q,
                    Storage, Scrolls) {
        var deferred = $q.defer();
        var MAX = 8;

        deferred.types = Storage.recent;
        deferred.scrolls = [];

        Scrolls.promise.then(function () {
            angular.forEach(deferred.types, function (v) {
                deferred.scrolls.push({s: Scrolls.look[v]});
            });

            deferred.resolve(deferred);
        });

        deferred.add = function (type) {
            deferred.promise.then(function () {
                var i = deferred.types.indexOf(type);

                if (i >= 0) {
                    deferred.types.splice(i, 1);
                    deferred.scrolls.splice(i, 1);
                }

                if ((i >= 0) || (i === -1)) {
                    deferred.types.unshift(type);
                    deferred.scrolls.unshift({s: Scrolls.look[type]});
                }

                if (deferred.types.length > MAX) {
                    var d = deferred.types.length - MAX;

                    deferred.types.splice(MAX, d);
                    deferred.scrolls.splice(MAX, d);
                }
            });
        };

        deferred.reset = function () {
            deferred.types.splice(0, deferred.types.length);
            deferred.scrolls.splice(0, deferred.scrolls.length);
        };

        return deferred;
    }

    angular.module('app.data').factory('Recent', Recent);
})();
