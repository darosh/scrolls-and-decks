(function () {
    'use strict';

    function appArt() {
        return {
            link: link
        };

        //noinspection JSUnusedLocalSymbols
        function link(scope, element, attrs) {
            //noinspection JSUnresolvedVariable
            element.css('background-position', attrs.appArt);
        }
    }

    angular.module('app.directives').directive('appArt', appArt);
})();
