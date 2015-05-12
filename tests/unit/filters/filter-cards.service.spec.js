'use strict';

describe('filter cards service', function () {
    var FilterCards, $timeout;

    beforeEach(module('app.filters'));

    beforeEach(inject(function (_FilterCards_, _$timeout_) {
        FilterCards = _FilterCards_;
        $timeout = _$timeout_;
        FilterCards.stats = {type: {total: [['human', 1]]}};
        FilterCards.sorted = [{s: {name: 'Rat', nameLowerCase: 'rat', set: 1}}];
    }));

    it('should be initialized', function () {
        expect(FilterCards.params).toBeDefined();
    });

    it('should return empty array', function () {
        expect(FilterCards.querySearch(null).length).toBe(0);
    });

    it('should return selected item', function () {
        var item = {name: 'dummy'};
        FilterCards.params.selectedItem = item;
        expect(FilterCards.querySearch(item.name)[0]).toBe(item);
    });

    it('should return search query promise', function () {
        expect(FilterCards.querySearch('search').then).toBeDefined();
    });

    it('should return resolve search query promise', function (done) {
        FilterCards.querySearch('search').then(function (res) {
            expect(res.length).toBe(0);
            done();
        });

        $timeout.flush();
    });

    it('should find kind', function (done) {
        FilterCards.querySearch('creature').then(function (res) {
            expect(res[0].kind).toBe(true);
            done();
        });

        $timeout.flush();
    });

    it('should find rarity', function (done) {
        FilterCards.querySearch('rare').then(function (res) {
            expect(res[0].rarity).toBe(true);
            done();
        });

        $timeout.flush();
    });

    it('should find type', function (done) {
        FilterCards.querySearch('human').then(function (res) {
            expect(res[0].type).toBe(true);
            done();
        });

        $timeout.flush();
    });

    it('should find rat', function (done) {
        FilterCards.querySearch('rat').then(function (res) {
            expect(res[0].name).toBe('Rat');
            done();
        });

        $timeout.flush();
    });
});
