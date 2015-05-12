'use strict';

describe('utils service', function () {
    var UtilsPaging, $timeout, $q, $rootScope;

    beforeEach(module('app.services'));

    beforeEach(inject(function (_UtilsPaging_, _$timeout_, _$q_, _$rootScope_) {
        UtilsPaging = _UtilsPaging_;
        $timeout = _$timeout_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should get and run iteration', function () {
        var self = {selectedIndex: 0, lazy: []},
            filter = {items: [{}]},
            params = {si: 0, limit: 1},
            quickRepeatList = {items: angular.noop};
        UtilsPaging.getPagingIteration(self, filter, params, quickRepeatList)();
        $timeout.flush();
    });

    it('should get and not run iteration', function () {
        var self = {selectedIndex: 0, lazy: []},
            filter = {items: [{}]},
            params = {si: 1, limit: 1},
            quickRepeatList = {items: angular.noop};
        UtilsPaging.getPagingIteration(self, filter, params, quickRepeatList)();
    });

    it('should get and run large iteration', function () {
        var self = {selectedIndex: 0, lazy: []},
            filter = {items: [{}]},
            params = {si: 0, limit: 21},
            quickRepeatList = {items: angular.noop};

        for(var i = 0; i < 20; i++) {
            self.lazy.push({});
            filter.items.push({});
        }

        filter.items.push({});

        UtilsPaging.getPagingIteration(self, filter, params, quickRepeatList)();
        $timeout.flush();
    });
});
