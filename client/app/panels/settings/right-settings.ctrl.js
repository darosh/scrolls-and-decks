(function () {
    'use strict';

    function RightSettingsCtrl($scope, $timeout, $window,
                               Settings, Storage, Recent, Bookmarks, Config) {
        var vm = this;

        vm.resetDecks = resetDecks;
        vm.resetSettings = resetSettings;
        vm.resetBookmarks = resetBookmarks;
        vm.resetRecent = resetRecent;
        vm.fullScreen = fullScreen;
        vm.fullScreenEnabled = $window.screenfull.enabled;
        vm.screenfull = {
            isFullscreen: $window.screenfull.isFullscreen
        };

        //noinspection JSUnresolvedVariable
        angular.element($window.document).on($window.screenfull.raw.fullscreenchange, function () {
            $scope.$apply(function () {
                vm.screenfull.isFullscreen = $window.screenfull.isFullscreen;
            });
        });

        function fullScreen() {
            $timeout(function () {
                $window.screenfull.toggle();
            }, Config.settingsDelay);
        }

        function resetRecent() {
            Recent.reset();
        }

        function resetBookmarks() {
            Bookmarks.reset();
        }

        function resetDecks() {
            // TODO(unfinished) resetDecks()
            Storage.reset('decks');
        }

        function resetSettings() {
            Settings.reset();
        }
    }

    angular.module('app.panels').controller('RightSettingsCtrl', RightSettingsCtrl);
})();
