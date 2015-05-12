(function () {
    'use strict';

    function DecksResource($resource) {
        return $resource('./data/decks.json').get();
    }

    angular.module('app.data').factory('DecksResource', DecksResource);
})();
