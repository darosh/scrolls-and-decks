/// <reference path="Scroll.ts" />

module ScrollsTypes {
    'use strict';

    export class Card {
        s:Scroll;
        c:number;

        constructor(scroll:Scroll, count:number = 1) {
            this.s = scroll;
            this.c = count;
        }
    }
}
