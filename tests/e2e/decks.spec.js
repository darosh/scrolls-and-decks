describe('decks page', function () {
    afterEach(function () {
        browser.driver.executeScript('return window.__coverage__').then(function (val) {
            global.collector.add(val || {});
        });
    });

    it('should load', function () {
        browser.get('http://localhost:8888/#/decks');
        var items = element.all(by.tagName('md-card'));
        expect(items.count()).toBeGreaterThan(1);
    });
});
