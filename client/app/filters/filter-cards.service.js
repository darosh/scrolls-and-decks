(function () {
    'use strict';

    function FilterCards(FilterUtils) {
        var self = {};

        self.text = {search: ''};
        self.params = angular.extend({
            star: 0,
            sort: 'cost',
            selectedItem: null
        }, FilterUtils.resources, FilterUtils.costs);
        self.querySearch = FilterUtils.query(self);
        self.setResource = FilterUtils.setResource(self);
        self.setCost = FilterUtils.setCost(self);

        return self;
    }

    angular.module('app.filters').factory('FilterCards', FilterCards);
})();
