(function () {
    'use strict';

    function Utils($q) {
        return {
            getComboPromise: getComboPromise,
            bookmarklet: bookmarklet
        };

        function getComboPromise(o) {
            var deferred = $q.defer();
            var p = [];

            angular.forEach(o, function (v) {
                p.push(v.promise);
            });

            $q.all(p).then(function () {
                deferred.resolve(deferred);
            });

            angular.extend(deferred, o);

            return deferred;
        }

        function bookmarklet(url) {
            var bm = (function () {
                window.SADurl = '{URL}';
                window.SADversion = 1;
                window.SADhome = window.SADurl + '#/deck';
                if (!window.SADscript) {
                    window.SADscript = document.createElement('script');
                    window.SADscript.src = window.SADurl + 'import.js';
                    document.getElementsByTagName('head')[0].appendChild(window.SADscript);
                    window.SADloaded = true;
                } else if (window.SADloaded) {
                    window.SADimport();
                }
            }).toString();

            return '(' + bm.replace(/\n/g, ' ').replace(/  +/g, ' ').replace('{URL}', url) + ')()';
        }
    }

    angular.module('app.services').factory('Utils', Utils);
})();
