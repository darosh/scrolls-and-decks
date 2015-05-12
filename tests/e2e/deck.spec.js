describe('deck page', function () {
    afterEach(function () {
        browser.driver.executeScript('return window.__coverage__').then(function (val) {
            global.collector.add(val || {});
        });
    });

    it('should open deck', function () {
        browser.get('http://localhost:8888/#/decks');
        element.all(by.tagName('md-card')).first().click();
    });
});
