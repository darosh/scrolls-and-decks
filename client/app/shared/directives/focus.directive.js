(function () {
    'use strict';

    function appFocus($timeout, $parse) {
        return {
            link: link
        };

        //noinspection JSUnusedLocalSymbols
        function link(scope, element, attrs) {
            var model = $parse(attrs.appFocus);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    }

    angular.module('app.directives').directive('appFocus', appFocus);
})();
