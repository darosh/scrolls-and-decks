describe('scrolls page', function () {
    afterEach(function () {
        browser.driver.executeScript('return window.__coverage__').then(function (val) {
            global.collector.add(val || {});
        });
    });

    it('should load', function () {
        browser.get('http://localhost:8888/');
        element(by.className('mdi-settings')).click();
    });
});
