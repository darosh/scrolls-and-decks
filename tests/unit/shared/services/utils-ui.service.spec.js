'use strict';

describe('utils service', function () {
    var UtilsUi, $timeout, $q, $rootScope;

    beforeEach(module('app.services'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function (_UtilsUi_, _$timeout_, _$q_, _$rootScope_) {
        UtilsUi = _UtilsUi_;
        $timeout = _$timeout_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should get tab delay', function () {
        expect(UtilsUi.getTabDelay()).toBeDefined();
    });

    it('should execute tab delay', function (done) {
        var o = {selectedIndex: 1};
        UtilsUi.getTabDelay(o, function(){
            expect(o.selectedIndexCopy).toBe(1);
            done();
        })();
        $timeout.flush();
    });
});
