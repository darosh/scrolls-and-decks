'use strict';

describe('filter decks service', function () {
    var FilterDecks;

    beforeEach(module('app.filters'));

    beforeEach(inject(function (_FilterDecks_) {
        FilterDecks = _FilterDecks_;
    }));

    it('should be initialized', function () {
        expect(FilterDecks.params).toBeDefined();
    });

    it('should return empty array', function () {
        expect(FilterDecks.querySearch(null).length).toBe(0);
    });
});
