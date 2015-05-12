(function () {
    'use strict';

    function SettingsCtrl(Settings, Config) {
        this.change = Settings.updateCopy;
        this.settings = Settings.settings;
        this.setAll = setAll;
        this.resetAll = resetAll;

        function resetAll() {
            angular.extend(Settings.settings, Config.settingsCards);
            Settings.updateCopy();
        }

        function setAll() {
            var s = angular.copy(Config.settingsCards);
            Settings.updateCopy();

            angular.forEach(s, function (v, k) {
                s[k] = true;
            });

            angular.extend(Settings.settings, s);
            Settings.updateCopy();
        }
    }

    angular.module('app.controllers').controller('SettingsCtrl', SettingsCtrl);
})();
