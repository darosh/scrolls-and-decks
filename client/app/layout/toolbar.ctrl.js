(function () {
    'use strict';

    function ToolbarCtrl($rootScope, $document,
                         $mdBottomSheet, $mdSidenav, $mdDialog, $state, $analytics,
                         Status, Settings) {
        this.state = $state;
        this.openBottom = openBottom;
        this.openRight = openRight;
        this.closeRight = closeRight;
        this.closeRightCard = closeRightCard;
        this.toggleLeft = toggleLeft;
        this.status = Status;
        //noinspection JSUnusedGlobalSymbols
        this.mainSwipeRight = openLeft;
        //noinspection JSUnusedGlobalSymbols
        this.mainSwipeLeft = closeLeft;
        //noinspection JSUnusedGlobalSymbols
        this.leftSwipeLeft = closeLeft;
        //noinspection JSUnusedGlobalSymbols
        this.rightSwipeRight = rightSwipeRight;
        this.settingsCopy = Settings.settingsCopy;
        this.filterHelp = filterHelp;
        this.pinCard = false;

        function filterHelp(ev) {
            var d = $mdDialog.alert()
                .theme(Settings.settings.dark ? 'dark' : 'default')
                .title('Import scrolls collection')
                .ok('Ok');

            /*eslint-disable no-underscore-dangle */
            delete d._options.template;
            d._options.templateUrl = 'app/shared/views/filter-search-help.html';
            d._options.parent = angular.element($document.body);
            d._options.targetEvent = ev;
            d._options.clickOutsideToClose = true;
            /*eslint-enable no-underscore-dangle */

            return $mdDialog.show(d);
        }

        function rightSwipeRight() {
            $mdSidenav('right-settings').close();
            $mdSidenav('right-card').close();
        }

        function openLeft() {
            $mdSidenav('left').open();
        }

        function closeLeft() {
            $mdSidenav('left').close();
        }

        function openBottom($event) {
            $mdBottomSheet.show({
                templateUrl: 'app/layout/bottom.html',
                targetEvent: $event
            }).then(function (target) {
                $state.go(target);
            });
        }

        function openRight(tab) {
            $mdSidenav('right-settings').toggle().then(function () {
                if (angular.isDefined(tab)) {
                    $rootScope.$emit('settingsTab', tab);
                }
            });
            //noinspection JSUnresolvedFunction
            $analytics.eventTrack('Settings', {category: 'Commands'});
        }

        function closeRight() {
            $mdSidenav('right-settings').close();
        }

        function closeRightCard() {
            $mdSidenav('right-card').close();
        }

        function toggleLeft() {
            $mdSidenav('left').toggle();
        }
    }

    angular.module('app').controller('ToolbarCtrl', ToolbarCtrl);
})();
