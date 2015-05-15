(function () {
    'use strict';

    function exception($provide) {
        function handler($delegate, $analytics, $log) {
            function decorator(exceptionObject, cause) {
                $delegate(exceptionObject, cause);
                $log.error(exceptionObject, cause);
                //noinspection JSUnresolvedFunction
                $analytics.eventTrack(exceptionObject.stack, {category: 'Exception'});
            }

            return decorator;
        }

        $provide.decorator('$exceptionHandler', handler);
    }

    angular.module('app').config(exception);
})();
