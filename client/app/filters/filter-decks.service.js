(function () {
    'use strict';

    function FilterDecks(FilterUtils) {
        var self = {};

        self.text = {search: ''};
        self.params = angular.extend({
            sort: 'name',
            selectedItem: null
        }, FilterUtils.resources);
        self.querySearch = function () {
            return [];
        };
        self.setResource = FilterUtils.setResource(self);

        return self;
    }

    angular.module('app.filters').factory('FilterDecks', FilterDecks);
})();
