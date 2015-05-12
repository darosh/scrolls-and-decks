(function () {
    'use strict';

    function Cards($q, $rootScope,
                   Storage, Scrolls) {
        var deferred = $q.defer();

        Scrolls.promise.then(function () {
            $rootScope.$watch(function () {
                return Storage.cards;
            }, function () {
                var types = Storage.cards && Storage.cards.types;
                ScrollsTypes._cardsReport = new ScrollsTypes.CardsReport(types, Scrolls);
                angular.extend(deferred, ScrollsTypes._cardsReport);
                ScrollsTypes._typesCounts = new ScrollsTypes.TypesCounts(ScrollsTypes._cardsReport[1].c);
                deferred.resolve(deferred);
                //ScrollsTypes.UpdateDecksMyCards();
            });
        });

        return deferred;
    }

    angular.module('app.data').factory('Cards', Cards);
})();
