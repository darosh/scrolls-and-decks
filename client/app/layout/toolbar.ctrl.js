(function () {
    'use strict';

    function ToolbarCtrl($rootScope, $document,
                         $mdBottomSheet, $mdSidenav, $mdDialog, $state, $analytics,
                         Status, Settings) {
        var vm = this;

        vm.state = $state;
        vm.openBottom = openBottom;
        vm.openRight = openRight;
        vm.closeRight = closeRight;
        vm.closeRightCard = closeRightCard;
        vm.toggleLeft = toggleLeft;
        vm.status = Status;
        //noinspection JSUnusedGlobalSymbols
        vm.mainSwipeRight = openLeft;
        //noinspection JSUnusedGlobalSymbols
        vm.mainSwipeLeft = closeLeft;
        //noinspection JSUnusedGlobalSymbols
        vm.leftSwipeLeft = closeLeft;
        //noinspection JSUnusedGlobalSymbols
        vm.rightSwipeRight = rightSwipeRight;
        vm.settingsCopy = Settings.settingsCopy;
        vm.filterHelp = filterHelp;
        vm.pinCard = false;

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
