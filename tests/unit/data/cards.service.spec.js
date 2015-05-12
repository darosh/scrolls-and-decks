'use strict';

describe('cards service', function () {
    var Cards, $httpBackend, $localStorage;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_$httpBackend_, _$localStorage_) {
        $httpBackend = _$httpBackend_;
        $localStorage = _$localStorage_;
        $localStorage.cards = {types: [1, 2, 3]};
    }));

    beforeEach(inject(function (_Cards_) {
        Cards = _Cards_;
    }));

    it('should work', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Cards.promise.then(function () {
            expect(Cards[0]).toBeDefined();
            done();
        });

        $httpBackend.flush();
    });
});
