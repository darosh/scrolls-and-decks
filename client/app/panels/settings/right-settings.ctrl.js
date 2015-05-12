(function () {
    'use strict';

    function RightSettingsCtrl($scope, $timeout, $window,
                               Settings, Storage, Recent, Bookmarks, Config) {
        $scope.resetDecks = resetDecks;
        $scope.resetSettings = resetSettings;
        $scope.resetBookmarks = resetBookmarks;
        $scope.resetRecent = resetRecent;
        $scope.fullScreen = fullScreen;
        $scope.fullScreenEnabled = $window.screenfull.enabled;
        $scope.screenfull = {
            isFullscreen: $window.screenfull.isFullscreen
        };

        //noinspection JSUnresolvedVariable
        angular.element($window.document).on($window.screenfull.raw.fullscreenchange, function () {
            $scope.$apply(function () {
                $scope.screenfull.isFullscreen = $window.screenfull.isFullscreen;
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
