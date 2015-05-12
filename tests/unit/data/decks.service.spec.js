'use strict';

describe('decks service', function () {
    var Decks, $httpBackend;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(inject(function (_Decks_) {
        Decks = _Decks_;
    }));

    it('should load default decks', function (done) {
        $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));
        $httpBackend.whenGET('./data/decks.json').respond(readJSON('client/data/decks.json'));

        Decks.promise.then(function(){
            expect(Decks[0].length).toBeGreaterThan(12);
            done();
        });

        $httpBackend.flush();
    });

    //it('should add deck', function (done) {
    //    $httpBackend.whenGET('./data/scrolls.json').respond(readJSON('client/data/scrolls.json'));
    //    $httpBackend.whenGET('./data/decks.json').respond(readJSON('client/data/decks.json'));
    //
    //    Decks.promise.then(function(){
    //        Decks.addDeck({types:[1,2,3]});
    //        done();
    //    });
    //
    //    $httpBackend.flush();
    //});
});
