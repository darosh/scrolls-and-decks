(function () {
    'use strict';

    function ScrollsResource($resource) {
        return $resource('./data/scrolls.json').get();
    }

    angular.module('app.data').factory('ScrollsResource', ScrollsResource);
})();
