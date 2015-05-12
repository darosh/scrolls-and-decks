(function () {
    'use strict';

    function Settings($timeout,
                      Storage, Config) {
        var service = {
            settings: angular.copy(Storage.settings),
            settingsCopy: angular.copy(Storage.settings),
            updateCopy: updateCopy,
            reset: reset
        };

        return service;

        function reset() {
            Storage.reset('settings');
            angular.copy(Storage.settings, service.settings);
            angular.copy(service.settings, service.settingsCopy);
        }

        function updateCopy() {
            $timeout(function () {
                angular.extend(service.settingsCopy, service.settings);
                angular.extend(Storage.settings, service.settings);
            }, Config.settingsDelay);
        }
    }

    angular.module('app.services').factory('Settings', Settings);
})();
