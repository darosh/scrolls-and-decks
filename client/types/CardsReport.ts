/// <reference path="CardsAndStats.ts" />
/// <reference path="Cards.ts" />

module ScrollsTypes {
    'use strict';

    export class CardsReport {
        0:CardsAndStats;
        1:CardsAndStats;
        2:CardsAndStats;

        constructor(types:number[], Scrolls:Scrolls) {
            this[0] = new CardsAndStats(ScrollsToCards(Scrolls.parsed));
            this[1] = new CardsAndStats(TypesToCards(types, Scrolls));
            this[2] = new CardsAndStats(MissingCards(this[1].c, Scrolls));
        }
    }
}
