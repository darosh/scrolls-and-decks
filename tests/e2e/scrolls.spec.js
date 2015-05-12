describe('scrolls page', function () {
    afterEach(function () {
        browser.driver.executeScript('return window.__coverage__').then(function (val) {
            global.collector.add(val || {});
        });
    });

    it('should load', function () {
        browser.get('http://localhost:8888/');

        var items = element.all(by.tagName('md-radio-button'));
        expect(items.count()).toEqual(8);
    });

    it('should filter', function () {
        browser.get('http://localhost:8888/');

        element(by.model('$mdAutocompleteCtrl.scope.searchText')).sendKeys('elan vital');
        var items = element.all(by.css('md-card[role=button]'));
        expect(items.count()).toEqual(1);
    });

    it('should show card', function () {
        browser.get('http://localhost:8888/');

        element.all(by.tagName('md-card')).first().click();
        expect(element(by.id('right-card-content')).getText()).toContain('You can handle one or two');
    });

    it('should open card', function () {
        browser.get('http://localhost:8888/');

        element.all(by.css('md-card[role=button]')).first().click();
        element(by.css('.md-toolbar-tools .mdi-share')).click();
        expect(element(by.tagName('md-card')).getText()).toContain('unit destroys another unit');
    });
});
