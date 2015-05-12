(function () {
    'use strict';

    function compile($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    }

    angular.module('app').config(compile);
})();
