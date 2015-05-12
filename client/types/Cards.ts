/// <reference path="Card.ts" />
/// <reference path="Scrolls.ts" />
/// <reference path="Stats.ts" />

module ScrollsTypes {
    'use strict';

    export class TypesCounts {
        items:{[index:number]:number} = {};

        constructor(cards:Card[]) {
            _.each(cards, (v:Card) => {
                this.items[v.s.id] = v.c;
            });
        }
    }

    export function TypesToCards(types:number[], scrolls:Scrolls):Card[] {
        var list:Card[] = [];
        var d:{[index:number]: Card} = {};

        _.each(types, function (v:number):void {
            if (!scrolls.look[v]) {
                return;
            }

            if (!d[v]) {
                d[v] = new Card(scrolls.look[v], 1);
                list.push(d[v]);
            } else {
                d[v].c++;
            }
        });

        return list;
    }

    export function ScrollsToCards(scrollsParsed:Scroll[]):Card[] {
        var list:Card[] = [];

        scrollsParsed.forEach(function (v:Scroll):void {
            list.push(new Card(v, 1));
        });

        return list;
    }

    export function MissingCards(havingCards:Card[], Scrolls:Scrolls):Card[] {
        var cards:Card[] = [];
        var d:{[index:number]:Card} = {};

        havingCards.forEach(function (v:Card):void {
            d[v.s.id] = new Card(v.s, 3 - v.c);

            if (d[v.s.id].c) {
                cards.push(d[v.s.id]);
            }
        });

        _.each(Scrolls.look, function (v:Scroll, t:string):void {
            if (!d[t]) {
                cards.push(new Card(v, 3));
            }
        });

        return cards;
    }

    export function RelatedCards(card:Card, Scrolls:Scrolls, max:number = 25):Card[] {
        var related:Card[] = [];

        function testAndAdd(tm:Scroll):void {
            if ((related.length < max) && (tm !== card.s) && !_.find(related, function (v:Card):boolean {
                    return v.s === tm;
                })) {
                related.push(new Card(tm));
            }
        }

        _.each(_.clone(card.s.typesArr).reverse(), function (t:string):void {
            _.each(Scrolls.types[card.s.r][t], testAndAdd);
        });

        if (!related.length) {
            _.each(Scrolls.kinds[card.s.r][card.s.kind], testAndAdd);
        }

        return related;
    }

    export function HavingMissingRemainingCards(myCards:Card[], deckCards:Card[]):Card[][] {
        var havingCards:Card[] = [];
        var missingCards:Card[] = [];
        var myRemainingCards:Card[] = [];

        var d:{[index:number]:Card} = {};

        _.each(myCards, function (v:Card):void {
            var n:Card = new Card(v.s, v.c);
            myRemainingCards.push(n);
            d[v.s.id] = n;
        });

        _.each(deckCards, function (v:Card):void {
            var my:number = d[v.s.id] ? d[v.s.id].c : 0;
            var de:number = v.c;
            var re:number;

            if (my >= de) {
                havingCards.push({c: de, s: v.s});
                // 0 missingCards;
                re = my - de;
                if (re > 0) {
                    myRemainingCards.push({c: re, s: v.s});
                }
            } else if (my === 0) {
                // 0 havingCards.push({c: de, s: v.s});
                missingCards.push({c: de, s: v.s});
                // 0 myRemainingCards
            } else {
                havingCards.push({c: my, s: v.s});
                missingCards.push({c: de - my, s: v.s});
                // 0 myRemainingCards
            }
        });

        return [deckCards, havingCards, missingCards, myRemainingCards];
    }
}
