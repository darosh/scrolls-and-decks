/// <reference path="Global.ts" />
/// <reference path="Decks.ts" />

module ScrollsTypes {
    'use strict';

    export class DeckCards {
        cards:CardsAndStats[] = [];
        deck:Deck;

        constructor(deck:Deck) {
            this.deck = deck;
            this.update();
        }

        update():void {
            var r:Card[] = TypesToCards(this.deck.types, _scrolls);
            var c:Card[][] = HavingMissingRemainingCards(_cardsReport[1].c, r);

            this.cards[0] = new CardsAndStats(c[0], true, true);
            this.cards[1] = new CardsAndStats(c[1], true, true);
            this.cards[2] = new CardsAndStats(c[2], true, true);
        }

        addType(type:number):number {
            removeDeckStats(this.deck);

            var added:number = this.deck.addType(type);
            this.update();

            addDeckStats(this.deck);
            GetDecksStats();

            return added;
        }

        removeType(type:number):number {
            removeDeckStats(this.deck);

            var removed:number = this.deck.removeType(type);
            this.update();

            addDeckStats(this.deck);
            GetDecksStats();

            return removed;
        }

        replaceDeck(deck:DeckExtended):void {
            // this.deck.setDeck(deck.deck);
            this.deck.deck = deck.deck;

            // this.deck.setAuthor(deck.author);
            this.deck.author = deck.author;

            this.deck.origin = deck.origin;
            this.replaceTypes(deck.types);
        }

        replaceTypes(types:number[]):void {
            removeDeckStats(this.deck);

            _.each(_.clone(this.deck.types), (v:number) => {
                this.deck.removeType(v);
            });

            _.each(types, (v:number) => {
                this.deck.types.push(v);
            });

            this.deck.update();
            this.update();
            addDeckStats(this.deck);
            GetDecksStats();
        }
    }
}
