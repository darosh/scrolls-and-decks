(function () {
    'use strict';

    function Storage($localStorage,
                     Config) {
        var service = {
            reset: reset,
            set: set
        };

        var defaults = {
            bookmarks: [],
            recent: [],
            decks: [],
            cards: {},
            settings: Config.settings
        };

        var ls = $localStorage.$default(defaults);
        angular.extend(service, ls);
        return service;

        function set(name, value) {
            service[name] = value;
            $localStorage[name] = value;
        }

        function reset(name) {
            if (name) {
                angular.copy(defaults[name], $localStorage[name]);
            } else {
                angular.extend(service, defaults);
            }
        }
    }

    angular.module('app.storage').factory('Storage', Storage);
})();
