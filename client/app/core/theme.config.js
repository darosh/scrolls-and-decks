(function () {
    'use strict';

    function theme($mdThemingProvider) {
        var blue = true;

        if (blue) {
            $mdThemingProvider.definePalette('alt', $mdThemingProvider.extendPalette('blue-grey', {'A100': 'DFE7EB'}));
            $mdThemingProvider.definePalette('bg', $mdThemingProvider.extendPalette('blue-grey', {}));

            //noinspection JSUnresolvedFunction
            $mdThemingProvider.theme('default')
                .backgroundPalette('alt')
                .warnPalette('blue-grey')
                .primaryPalette('bg')
                .accentPalette('blue-grey', {'default': '600'});
        } else {
            $mdThemingProvider.definePalette('light-bg', $mdThemingProvider.extendPalette('brown', {'A100': 'E8E8E8'}));
            $mdThemingProvider.definePalette('light-primary', $mdThemingProvider.extendPalette('brown', {'500': '7A746C'}));
            $mdThemingProvider.definePalette('light-accent', $mdThemingProvider.extendPalette('brown', {'500': '7A746C'}));

            //noinspection JSUnresolvedFunction
            $mdThemingProvider.theme('default')
                .backgroundPalette('light-bg')
                .warnPalette('brown')
                .primaryPalette('light-primary')
                .accentPalette('light-accent', {'default': '500'});
        }

        //$mdThemingProvider.definePalette('alt-dark', $mdThemingProvider.extendPalette('blue-grey', {'800': '444858'}));
        $mdThemingProvider.definePalette('alt-dark', $mdThemingProvider.extendPalette('grey', {'800': '494744'}));
        $mdThemingProvider.definePalette('accent', $mdThemingProvider.extendPalette('amber', {'500': 'E0AA07'}));
        $mdThemingProvider.definePalette('alt-amber', $mdThemingProvider.extendPalette('amber', {'500': 'E0AA07'}));

        //noinspection JSUnresolvedFunction
        $mdThemingProvider.theme('dark')
            .backgroundPalette('alt-dark')
            .primaryPalette('alt-amber')
            .accentPalette('accent')
            .dark();

        $mdThemingProvider.alwaysWatchTheme(true);
    }

    angular.module('app.core').config(theme);
})();
