describe('help page', function () {
    afterEach(function () {
        browser.driver.executeScript('return window.__coverage__').then(function (val) {
            global.collector.add(val || {});
        });
    });

    it('should load', function () {
        browser.get('http://localhost:8888/#/help');

        var items = element.all(by.tagName('md-card'));
        //expect(items.count()).toEqual(12);
        expect(items.count()).toEqual(11);
    });
});
