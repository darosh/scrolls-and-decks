(function () {
    'use strict';

    function Bookmarks($q,
                       Storage, Scrolls) {
        var deferred = $q.defer();

        deferred.types = Storage.bookmarks;
        deferred.scrolls = [];
        deferred.look = {};

        Scrolls.promise.then(function () {
            angular.forEach(deferred.types, function (v) {
                deferred.scrolls.push({s: Scrolls.look[v]});
                deferred.look[v] = true;
            });

            deferred.resolve(deferred);
        });

        deferred.set = function (type) {
            deferred.promise.then(function () {
                if (deferred.   look[type]) {
                    deferred.look[type] = false;
                    var i = deferred.types.indexOf(type);
                    deferred.types.splice(i, 1);
                    deferred.scrolls.splice(i, 1);
                } else {
                    deferred.look[type] = true;
                    deferred.types.unshift(type);
                    deferred.scrolls.unshift({s: Scrolls.look[type]});
                }
            });
        };

        deferred.reset = function () {
            deferred.types.splice(0, deferred.types.length);
            deferred.scrolls.splice(0, deferred.scrolls.length);
            angular.copy({}, deferred.look);
        };

        return deferred;
    }

    angular.module('app.data').factory('Bookmarks', Bookmarks);
})();
