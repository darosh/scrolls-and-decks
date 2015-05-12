'use strict';

describe('settings service', function () {
    var Settings;

    beforeEach(module('app.services'));

    beforeEach(inject(function (_Settings_) {
        Settings = _Settings_;
    }));

    it('should be initialized', function () {
        expect(Settings.settings).toBeDefined();
    });
});
