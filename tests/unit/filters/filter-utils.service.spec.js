'use strict';

describe('filter cards service', function () {
    var FilterCards, FilterUtils, $timeout;

    beforeEach(module('app.filters'));

    beforeEach(inject(function (_FilterCards_, _FilterUtils_, _$timeout_) {
        FilterCards = _FilterCards_;
        FilterUtils = _FilterUtils_;
        $timeout = _$timeout_;
        FilterCards.stats = {type: {total: {human: {}}}};
        FilterCards.sorted = [{s: {name: 'Rat', nameLowerCase: 'rat', set: 1}}];
        FilterCards.setFilter = _FilterUtils_.setFilter(FilterCards);
    }));

    it('should set filter to "g" only', function () {
        FilterCards.setFilter({}, 'dummy', 'r0');
        expect(FilterCards.params.g).toBe(true);
        expect(FilterCards.params.e).toBe(false);
        expect(FilterCards.params.o).toBe(false);
        expect(FilterCards.params.d).toBe(false);
    });

    it('should set filter to all', function () {
        FilterCards.setFilter({}, 'dummy');
        expect(FilterCards.params.g).toBe(true);
        expect(FilterCards.params.e).toBe(true);
        expect(FilterCards.params.o).toBe(true);
        expect(FilterCards.params.d).toBe(true);
    });

    it('should set filter to text only', function () {
        FilterCards.params.selectedItem = null;
        FilterCards.setFilter(null, 'dummy');
        expect(FilterCards.params.selectedItem).toBe(null);
        expect(FilterCards.text.search).toBe('dummy');
    });

    it('should set filter to object', function () {
        FilterCards.params.selectedItem = null;
        FilterCards.setFilter('creature', 'dummy');
        expect(FilterCards.params.selectedItem.name).toBe('dummy');
        expect(FilterCards.params.selectedItem.creature).toBe(true);
        expect(FilterCards.text.search).toBe('dummy');
    });
});
