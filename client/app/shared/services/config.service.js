(function () {
    'use strict';

    function Config($window) {
        var settings = {
            image: true,
            highlight: false,
            decksHighlight: true,
            decksAuthor: true,
            decksScrolls: true,
            decksChart: true,
            animate: true,
            mirror: false
        };

        var settingsCards = {
            image: true,
            highlight: false,
            bundle: false,
            name: false,
            type: false,
            rarity: false,
            decks: false,
            description: false,
            flavor: false
        };

        var settingsCard = {
            image: true,
            rarity: true,
            decks: true,
            name: true,
            type: true,
            description: true,
            flavor: true,
            link: true
        };

        var json = '.json';

        return {
            settingsDelay: 450,
            tabDelay: 650,
            cardDelay: 25,
            cardBatchDelay: 0,
            cardMinDelay: 0,
            version: '%VERSION%',
            build: new Date('%BUILD%'),
            officialApp: 'https://darosh.github.io/scrolls-and-decks/',
            repository: 'https://github.com/darosh/scrolls-and-decks/',
            // prevent file name build revision
            contentSource: 'https://github.com/darosh/scrolls-and-decks/blob/master/client/data/scrolls' + json,
            license: 'https://github.com/darosh/scrolls-and-decks/blob/master/LICENSE',
            issues: 'https://github.com/darosh/scrolls-and-decks/issues',
            currentInstance: $window.location.origin + $window.location.pathname,
            settings: settings,
            settingsCard: settingsCard,
            settingsCards: settingsCards,
            settingsCardFull: angular.extend(angular.copy(settingsCard), {terms: true, link: false, bundle: true})
        };
    }

    angular.module('app.services').factory('Config', Config);
})();
