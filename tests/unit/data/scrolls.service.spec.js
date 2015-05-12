'use strict';

describe('scrolls service', function () {
    var Scrolls, $httpBackend;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(inject(function (_Scrolls_) {
        Scrolls = _Scrolls_;
    }));

    it('should do something', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Scrolls.promise.then(function(){
            expect(Scrolls.parsed.length).toBeGreaterThan(300);
            done();
        });

        $httpBackend.flush();
    });
});
