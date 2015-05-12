/// <reference path="Card.ts" />
/// <reference path="Stats.ts" />

module ScrollsTypes {
    'use strict';

    export class CardsAndStats {
        c:Card[];
        s:Stats;

        constructor(cards:Card[], all:boolean = false, full:boolean = false) {
            this.c = cards;
            this.s = new Stats(cards, all, full);
        }
    }
}
