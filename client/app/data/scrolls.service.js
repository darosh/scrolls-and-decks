(function () {
    'use strict';

    function Scrolls($q,
                     ScrollsResource, WebP) {
        var deferred = $q.defer();

        $q.all([ScrollsResource.$promise, WebP.promise]).then(function (result) {
            ScrollsTypes._scrolls = new ScrollsTypes.Scrolls(result[0], WebP.webp);
            angular.extend(deferred, ScrollsTypes._scrolls);
            deferred.resolve(deferred);
        });

        return deferred;
    }

    angular.module('app.data').factory('Scrolls', Scrolls);
})();
