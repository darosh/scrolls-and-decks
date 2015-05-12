(function () {
    'use strict';

    function FilterDeck(FilterUtils) {
        var self = {};

        self.text = {search: ''};
        self.params = angular.extend({
            star: 0,
            selectedItem: null
        }, FilterUtils.resources, FilterUtils.costs);
        self.setResource = FilterUtils.setResource(self);
        self.setCost = FilterUtils.setCost(self);

        return self;
    }

    angular.module('app.filters').factory('FilterDeck', FilterDeck);
})();
