'use strict';

describe('combo promise', function () {
    var CardsDecks, ScrollsDecks;

    beforeEach(module('app.data'));

    beforeEach(inject(function (_CardsDecks_, _ScrollsDecks_) {
        CardsDecks = _CardsDecks_;
        ScrollsDecks = _ScrollsDecks_;
    }));

    it('should be initialized', function () {
        expect(CardsDecks.promise.then).toBeDefined();
        expect(ScrollsDecks.promise.then).toBeDefined();
    });
});
