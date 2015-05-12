/// <reference path="Global.ts" />

module ScrollsTypes {
    'use strict';

    export function AddDecks(decks:any, isStarter:boolean = false, isInGame:boolean = false):void {
        _.each(decks, function (d:any):void {
            AddDeck(d, isStarter, isInGame);
        });
    }

    export function AddStoredDecks(decks:any):void {
        _.each(decks, function (d:any):void {
            AddDeck(d, false, false, false, d);
        });
    }

    export function GetDeckByHash(hash:string):Deck|any {
        return _.find(_decks, function (v:Deck):boolean {
            return v.hash === hash;
        });
    }

    export function AddDeck(deck:any, isStarter:boolean = false, isInGame:boolean = false, isClone:boolean = false,
                            storageId:number = null):number {
        var d:Deck = new Deck(deck, isStarter, isInGame, storageId);

        if (isClone) {
            d.deck = 'Clone of ' + d.deck;
        }

        _decks.push(d);

        addDeckStats(d);

        return d.id;
    }

    export function addDeckStats(d:Deck):void {
        _decksStats[0][d.code] = (_decksStats[0][d.code] || 0) + 1;

        if (d.have === d.types.length) {
            _decksStats[1][d.code] = (_decksStats[1][d.code] || 0) + 1;
            _decksCategorized[1].push(d);
        } else {
            _decksStats[2][d.code] = (_decksStats[2][d.code] || 0) + 1;
            _decksCategorized[2].push(d);
        }
    }

    export function RemoveDeck(deck:Deck):void {
        _decks[deck.id] = null;

        deck.types.forEach((t:number) => {
            var s:Scroll = _scrolls.look[t];

            if (s) {
                delete s.decks[deck.id];
                s.updateDecksCount();
            }
        });

        removeDeckStats(deck);
        GetDecksStats();
    }

    export function removeDeckStats(deck:Deck):void {
        _decksStats[0][deck.code]--;

        if (!_decksStats[0][deck.code]) {
            delete _decksStats[0][deck.code];
        }

        if (_decksStats[1][deck.code]) {
            _decksStats[1][deck.code]--;

            if (!_decksStats[1][deck.code]) {
                delete _decksStats[1][deck.code];
            }

            _decksCategorized[1].splice(_decksCategorized[1].indexOf(deck), 1);
        } else {
            _decksStats[2][deck.code]--;

            if (!_decksStats[2][deck.code]) {
                delete _decksStats[2][deck.code];
            }

            _decksCategorized[2].splice(_decksCategorized[2].indexOf(deck), 1);
        }
    }

    function getStats(stats:{[index:string]:number}):{}[] {
        return _.sortBy(_.map(stats, function (v:number, k:string):{} {
            var val:number = parseInt(k, 10);

            /*jslint bitwise: true */
            /*tslint:disable:no-bitwise */
            return {
                count: v,
                val: val,
                g: val & 8,
                e: val & 4,
                o: val & 2,
                d: val & 1
            };
        }), 'count').reverse();
    }

    export function GetDecksStats():{}[] {
        _allDecksStats[0] = getStats(_decksStats[0]);
        _allDecksStats[1] = getStats(_decksStats[1]);
        _allDecksStats[2] = getStats(_decksStats[2]);

        return _allDecksStats;
    }

    export function CountScrollsDecks():void {
        _.each(_scrolls.look, function (s:Scroll):void {
            s.updateDecksCount();
        });
    }

    export function ResetDecks():void {
        _.remove(_decksCategorized[0]);
        _.remove(_decksCategorized[1]);
        _.remove(_decksCategorized[2]);
    }
}
