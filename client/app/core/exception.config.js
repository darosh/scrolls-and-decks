(function () {
    'use strict';

    function exception($provide) {
        function handler($delegate, $analytics) {
            function decorator(exception, cause) {
                $delegate(exception, cause);
                //noinspection JSUnresolvedFunction
                $analytics.eventTrack(exception.stack, {category: 'Exception'});
            }

            return decorator;
        }

        $provide.decorator('$exceptionHandler', handler);
    }

    angular.module('app').config(exception);
})();
