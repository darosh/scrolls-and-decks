'use strict';

describe('cards types', function () {
    it('counting should work', function () {
        var hm = ScrollsTypes.HavingMissingRemainingCards(
            [{c: 1, s: {id: 1}}, {c: 1, s: {id: 2}}, {c: 3, s: {id: 4}}, {c: 1, s: {id: 10}}, {c: 3, s: {id: 11}}],
            [{c: 1, s: {id: 1}}, {c: 1, s: {id: 3}}, {c: 3, s: {id: 7}}, {c: 3, s: {id: 10}}, {c: 1, s: {id: 11}}]
        );

        expect(hm.length).toBe(4);
    });

    it('conversion should work', function () {
        var tc = ScrollsTypes.TypesToCards([1, 2, 2], {look: {}});
        expect(tc.length).toBeDefined();
    });
});
