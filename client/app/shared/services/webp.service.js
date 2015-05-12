(function () {
    'use strict';

    // https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_using_javascript

    function WebP($q) {
        var deferred = $q.defer();
        var img = new Image();

        img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
        img.onload = img.onerror = function () {
            deferred.webp = (img.width > 0) && (img.height > 0);
            deferred.resolve();
        };

        return deferred;
    }

    angular.module('app.services').factory('WebP', WebP);
})();
