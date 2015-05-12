/// <reference path="Global.ts" />

module ScrollsTypes {
    'use strict';

    export class DeckSimple {
        deck:string;
        author:string;
        types:number[];

        constructor();
        constructor(d:DeckSimple);
        constructor(d?:DeckSimple) {
            if (d) {
                this.deck = d.deck;
                this.author = d.author;

                if (_.isString(d.types)) {
                    this.types = [];
                    var s:string[] = d.types.toString().split(',');

                    _.each(s, (v:string):void => {
                        this.types.push(parseInt(v, 10));
                    });
                } else {
                    this.types = d.types;
                }
            }
        }

        getDeckHash():string {
            return _.sortBy(this.types).join(',');
        }
    }

    export class DeckExtended extends DeckSimple {
        origin:string;

        constructor();
        constructor(d:DeckExtended);
        constructor(d?:DeckExtended) {
            if (d) {
                super(d);
                this.origin = d.origin;
            }
        }
    }

    interface ITypesCounts {
        [index:number]:number
    }

    export class Deck extends DeckExtended {
        deckLowerCase:string;
        authorLowerCase:string;
        starter:boolean;
        growth:number;
        order:number;
        energy:number;
        decay:number;
        havePercent:number;
        have:number;
        price:number;
        priceTotal:number;
        growthPercent:number;
        energyPercent:number;
        orderPercent:number;
        decayPercent:number;
        g:boolean;
        e:boolean;
        o:boolean;
        d:boolean;
        sort:string;
        code:number;
        stats:Stats;
        id:number;
        storageId:{};
        counts:ITypesCounts;
        // hash:string;
        private _deck:string;
        private _author:string;

        constructor(d:any, starter:boolean, scrollsCom:boolean, storageId:{} = null) {
            super();
            this.origin = d.origin || (scrollsCom ? 'http://scrolls.com' : '');
            // this.setAuthor(d.author);
            this.author = d.author;
            // this.setDeck(d.deck);
            this.deck = d.deck;
            this.types = d.types || [];
            this.starter = starter;
            this.id = _decks.length;
            this.storageId = storageId;
            this.update();
            // this.hash = this.getDeckHash();
        }

        get hash():string {
            return this.getDeckHash();
        }

        get deck():string {
            return this._deck;
        }

        /*tslint:disable:typedef */
        set deck(value:string) {
            this._deck = value || '?';
            this.deckLowerCase = this._deck.toLowerCase();
        }

        // setDeck(deck:string):void {
        //    this.deck = deck || '?';
        //    this.deckLowerCase = this.deck.toLowerCase();
        // }

        get author():string {
            return this._author;
        }

        /*tslint:disable:typedef */
        set author(value:string) {
            this._author = value || '?';
            this.authorLowerCase = this._author.toLowerCase();
        }

        // setAuthor(author:string):void {
        //    this.author = author || '?';
        //    this.authorLowerCase = this.author.toLowerCase();
        // }

        update():void {
            this.countTypes();
            this.updatePricing();
            this.updateSortString();
            this.updateResourcePercents();
            this.updateResourceFlags();
            this.updateCode();
            this.updateStats();
        }

        toDeckSimple():DeckSimple {
            return new DeckSimple(this);
        }

        toDeckExtended():DeckExtended {
            return new DeckExtended(this);
        }

        addType(type:number):number {
            var l:number = this.counts[type] || 0;

            if (l < 3) {
                this.types.push(type);
                this.counts[type] = l + 1;
                this.update();
                return 1;
            }

            return 0;
        }

        removeType(type:number):number {
            var l:number = this.counts[type] || 0;

            if (l > 1) {
                this.counts[type] = l - 1;
                this.types.splice(this.types.indexOf(type), 1);
                this.update();
                return 1;
            } else if (l > 0) {
                delete this.counts[type];
                this.types.splice(this.types.indexOf(type), 1);
                this.update();
                return 1;
            }

            return 0;
        }

        countTypes():void {
            this.counts = {};

            this.growth = 0;
            this.order = 0;
            this.energy = 0;
            this.decay = 0;

            this.types.forEach((t:number) => {
                var s:Scroll = _scrolls.look[t];

                if (s) {
                    this.growth += !!s.growth ? 1 : 0;
                    this.energy += !!s.energy ? 1 : 0;
                    this.decay += !!s.decay ? 1 : 0;
                    this.order += !!s.order ? 1 : 0;

                    s.decks[this.id] = this;
                }

                this.counts[t] = (this.counts[t] || 0) + 1;
            });
        }

        updatePricing():void {
            var have:number = 0;
            var price:number = 0;
            var priceTotal:number = 0;

            _.each(this.counts, function (c:number, t:string):void {
                var mt:number = _typesCounts.items[t] || 0;
                have += (mt >= c) ? c : mt;
                var p:number = _scrolls.look[t] ? _scrolls.look[t].price : 0;
                priceTotal += c * p;

                if (mt < c) {
                    price += (c - mt) * p;
                }
            });

            this.havePercent = Math.floor((have / (this.types.length || 1)) * 100);
            this.have = have;
            this.price = price;
            this.priceTotal = priceTotal;
        }

        updateResourcePercents():void {
            this.growthPercent = (this.growth / (this.types.length || 1)) * 100;
            this.energyPercent = (this.energy / (this.types.length || 1)) * 100;
            this.decayPercent = (this.decay / (this.types.length || 1)) * 100;
            this.orderPercent = (this.order / (this.types.length || 1)) * 100;
        }

        updateSortString():void {
            function num(n:number):string {
                return (n < 10 ? '00' : (n < 100 ? '0' : '')) + n;
            }

            this.sort = num(this.growth) +
                num(this.energy) +
                num(this.order) +
                num(this.decay);
        }

        updateResourceFlags():void {
            this.g = this.growth > 0;
            this.e = this.energy > 0;
            this.o = this.order > 0;
            this.d = this.decay > 0;
        }

        updateCode():void {
            this.code = (this.g ? 8 : 0) + (this.e ? 4 : 0) + (this.o ? 2 : 0) + (this.d ? 1 : 0);
        }

        updateStats():void {
            var cards:Card[] = [];

            _.each(this.counts, function (v:number, k:string):void {
                cards.push(new Card(_scrolls.look[k], v));
            });

            this.stats = new Stats(cards, true, true);
        }
    }
}
