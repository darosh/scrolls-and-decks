'use strict';

describe('decks types', function () {
    it('should add deck', function () {
        var d = {types: [1, 2, 2, 3, 3, 4, 5, 5, 5]};
        var l = ScrollsTypes._decks.length;
        ScrollsTypes.AddDeck(d);
        expect(ScrollsTypes._decks.length).toBe(l + 1);
        expect(ScrollsTypes._decks[ScrollsTypes._decks.length - 1].types.length).toBe(d.types.length);
    });
});
