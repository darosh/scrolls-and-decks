'use strict';

describe('recent service', function () {
    var Recent, $httpBackend;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_Recent_, _$httpBackend_) {
        Recent = _Recent_;
        $httpBackend = _$httpBackend_;
    }));

    it('should be initialized', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Recent.promise.then(function(){
            expect(Recent.types.length).toBeDefined(300);
            expect(Recent.scrolls.length).toBeDefined(300);
            done();
        });

        $httpBackend.flush();
    });

    it('should add item', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));

        Recent.promise.then(function(){
            Recent.add(3);
            done();
        });

        $httpBackend.flush();
    });
});
