'use strict';

describe('bookmarks service', function () {
    var Bookmarks, $httpBackend;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_$localStorage_) {
        _$localStorage_.bookmarks = [1];
    }));

    beforeEach(inject(function (_Bookmarks_, _$httpBackend_) {
        Bookmarks = _Bookmarks_;
        $httpBackend = _$httpBackend_;
    }));

    it('should be initialized', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Bookmarks.promise.then(function () {
            expect(Bookmarks.types).toBeDefined();
            done();
        });

        $httpBackend.flush();
    });

    it('should set bookmark', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Bookmarks.promise.then(function () {
            Bookmarks.set(4);
            Bookmarks.promise.then(function () {
                expect(Bookmarks.types[0]).toBe(4);
                done();
            });
        });

        $httpBackend.flush();
    });
});
