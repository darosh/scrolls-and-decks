(function () {
    'use strict';

    function Status() {
        return {
            card: null
        };
    }

    angular.module('app.services').factory('Status', Status);
})();
