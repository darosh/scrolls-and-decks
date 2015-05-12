(function () {
    'use strict';

    function HelpCtrl($scope, $document, $timeout,
                      $state,
                      Scrolls,
                      UtilsUi, Utils, Config, Status) {
        UtilsUi.setTitle('Help');
        $scope.config = Config;
        $scope.scrolls = Scrolls;
        $scope.bm = Utils.bookmarklet(Config.currentInstance);
        Status.fab = null;
        $scope.$on('$locationChangeSuccess', scrollDelayMore);
        $scope.$on('$viewContentLoaded', scrollDelay);

        $timeout(function () {
            var el = $document[0].getElementById('page-content');
            el.focus();
        });

        function scroll() {
            //noinspection JSUnresolvedVariable
            var s = $state.params.section;

            if (s) {
                var el = $document[0].getElementById(s);

                if (el) {
                    $document[0].getElementById('page-content').scrollTop = el.offsetTop - 16;
                }
            }
        }

        function scrollDelayMore() {
            $timeout(scroll, 250);
        }

        function scrollDelay() {
            $timeout(scroll);
        }
    }

    angular.module('app').controller('HelpCtrl', HelpCtrl);
})();
