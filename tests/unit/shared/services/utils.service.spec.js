'use strict';

describe('utils service', function () {
    var Utils, $timeout, $q, $rootScope;

    beforeEach(module('app.services'));

    beforeEach(inject(function (_Utils_, _$timeout_, _$q_, _$rootScope_) {
        Utils = _Utils_;
        $timeout = _$timeout_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should get combo promise', function () {
        expect(Utils.getComboPromise({'a': {promise: {}}, 'b': {promise: {}}})).toBeDefined();
    });

    it('should resolve combo promise', function (done) {
        var d1 = $q.defer();
        var d2 = $q.defer();

        Utils.getComboPromise({'a': {promise: d1.promise}, 'b': {promise: d2.promise}}).promise.then(function(){
            done();
        });

        d1.resolve();
        d2.resolve();

        $rootScope.$apply();
    });
});
