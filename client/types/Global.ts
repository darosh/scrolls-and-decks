/// <reference path="CardsReport.ts" />
/// <reference path="Deck.ts" />

module ScrollsTypes {
    'use strict';

    export var _scrolls:Scrolls;
    export var _cardsAndStats:CardsAndStats;
    export var _typesCounts:TypesCounts;
    export var _cardsReport:CardsReport;
    export var _allDecksStats:{}[] = [];

    export var _decks:Deck[] = [];
    export var _decksCategorized:Deck[][] = [_decks, [], []];
    export var _decksStats:{[index:string]:number}[] = [{}, {}, {}];
}
