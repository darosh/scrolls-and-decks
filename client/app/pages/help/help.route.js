(function () {
    'use strict';

    function routes($stateProvider) {
        $stateProvider
            .state('help', {
                url: '/help',
                views: {
                    body: {
                        templateUrl: 'app/pages/help/help.html',
                        controller: 'HelpCtrl',
                        resolve: {
                            Scrolls: function (Scrolls) {
                                return Scrolls.promise;
                            }
                        }
                    },
                    side: {
                        templateUrl: 'app/pages/help/help-left.html'
                    },
                    bar: {
                        templateUrl: 'app/layout/bar.html'
                    }
                }
            })
            .state('help.section', {
                url: '/:section'
            });
    }

    angular.module('app').config(routes);
})();
