/// <reference path="../../typings/lodash/lodash.d.ts" />

module ScrollsTypes {
    'use strict';

    export enum Resource {g, e, o, d}

    export enum Rarity {Common, Uncommon, Rare}

    function html(t:string, noBreak:boolean = false):string {
        return t && t.replace(/\\n/g, '\n')
                .trim()
                .replace(/\.\.\./g, '&hellip;')
                .replace(/(<[^>]+)\\n([^>]+>)/g, '$1 $2')
                .replace(/\[([^\]]+)]/g, '<b>$1<\/b>')
                .replace(/\.\n/g, '.<br />')
                .replace(/\n/g, noBreak ? ' ' : '<br />');
    }

    function htmlFlavor(t:string):string {
        return t && t
                .replace(/"([^"]+)"/g, '&ldquo;$1&rdquo;')
                .replace(/-/g, '&mdash;');
    }

    function scrollLink(t:string, types:Scroll[]):string {
        return t && t.replace(/<([^>]+)>/g, function (match:any, group:string):string {
                var g:string = group.replace(/\\n/g, ' ');

                var id:number = _.find(types, function (v:Scroll):boolean {
                    return g.indexOf(v.name) === 0;
                }).id;

                return '<a href="./#/scroll/' + id + '">' + g + '</a>';
            });
    }

    function noScrollLink(t:string):string {
        return t && t.replace(/<([^>]+)>/g, '<b>$1<\/b>');
    }

    function trait(v:string[]):string {
        var tr:RegExp = /^[^:\d]+/;
        var m:string[] = v[0].match(tr);
        var r:string = m[0].trim();

        return r[0].toUpperCase() + r.substr(1);
    }

    function getTerms(text:string):{} {
        var r:{} = {};
        var rx:RegExp = /\[([^\]]+)]/g;
        var match:RegExpExecArray = rx.exec(text);

        while (match !== null) {
            r[match[1].toLowerCase()] = true;
            match = rx.exec(text);
        }

        return r;
    }

    function traitLink(v:any):string[]|any {
        if (!v.match) {
            return v;
        }

        var tr:RegExp = /^[^:\d]+/;
        var m:string[] = v.match(tr);
        var r:string = _.trim(m[0]);
        var l:string = r[0].toUpperCase() + r.substr(1).toLowerCase();
        var x:RegExp = new RegExp('^' + r);

        return [r, l, v.replace(x, '')];
    }

    export class Scroll {
        id:number;
        name:string;
        nameLowerCase:string;
        flavor:string;
        description:string;
        descriptionLink:string;
        rarity:Rarity;
        rarityText:string;
        kind:string;
        types:string;
        typesArr:string[];
        energy:number;
        growth:number;
        order:number;
        decay:number;
        cost:number;
        r:string;
        ri:number;
        ap:number;
        ac:number|string|any;
        hp:number;
        p:boolean;
        set:number;
        price:number;
        L:string;
        M:string;
        S:string;
        Lc:string;
        Mc:string;
        Sc:string;
        rules:any[];
        traits:any[];
        bundle:number;
        terms:any[];
        decks:{} = {};
        decksCount:number = 0;

        constructor(v:any, data:any, webp:boolean = false) {
            var typesArr:string[] = v.types.split(',');
            typesArr = (typesArr.length && !typesArr[0]) ? [] : typesArr;
            v.img = v.img || '';
            this.id = v.id;
            this.name = v.name;
            this.nameLowerCase = v.name.toLowerCase();
            this.flavor = htmlFlavor(html(v.flavor));
            this.description = html(noScrollLink(v.desc), true);
            this.descriptionLink = html(scrollLink(v.desc, data.types), true);
            this.rarity = v.rarity;
            this.rarityText = Rarity[v.rarity];
            this.kind = v.kind;
            this.types = typesArr.join(', ');
            this.typesArr = typesArr;
            this.energy = v.energy;
            this.growth = v.growth;
            this.order = v.order;
            this.decay = v.decay;
            this.cost = v.growth + v.energy + v.order + v.decay;
            this.ri = v.growth ? Resource.g : v.energy ? Resource.e : v.order ? Resource.o : Resource.d;
            this.r = Resource[this.ri];
            this.ap = v.ap;
            this.ac = v.ac;
            this.hp = v.hp;
            this.hp = v.hp;
            this.set = v.set;
            this.price = v.price || 0;
            this.L = '0px ' + (-144 * v.img - 1) + 'px';
            this.M = '0px ' + (-63 * v.img - 1) + 'px';
            this.S = '-10px ' + (-48 * v.img - 1) + 'px';
            this.Lc = (webp ? 'app-art-webp-' : 'app-art-') + 'l-' + this.r;
            this.Mc = (webp ? 'app-art-webp-' : 'app-art-') + 'm-' + this.r;
            this.Sc = (webp ? 'app-art-webp-' : 'app-art-') + 's-' + this.r;
            this.bundle = v.bundle;
            this.traits = v.rules.map(trait);
            this.rules = v.rules.map(function (p:string[]):{} {
                return {
                    name: html(p[0])
                };
            });

            var t:{} = getTerms(v.desc);
            var terms:{} = {};

            _.each(t, function (v:string, k:string):void {
                if (data.strings[k]) {
                    terms[k] = data.strings[k];
                }
            });

            var tr:{} = getTerms(v.rules);

            _.each(tr, function (v:string, k:string):void {
                if (data.strings[k]) {
                    terms[k] = data.strings[k];
                }
            });

            _.each(v.rules, function (v:string[]):void {
                if (v) {
                    terms[v[0].toLowerCase()] = v;
                    v[0] = html(v[0]);

                    if (v[1].indexOf('${AMOUNT}') > -1) {
                        var e:RegExpExecArray = /^[^\d]+(\d)/.exec(v[0]);
                        v[1] = v[1].replace('${AMOUNT}', (e && e[1]) || 'amount');
                    }
                }
            });

            this.terms = _.pairs(terms);
            this.traits = _.uniq(this.traits.concat(_.map(this.terms, trait)));

            _.each(this.terms, function (v:any):void {
                v[1][0] = traitLink(v[1][0]);
            });

            this.p = (this.ap !== 0) || (this.ac !== 0) || (this.hp !== 0);
            this.ac = (this.ac === -1) ? '\u2014' : this.ac;
        }

        updateDecksCount():void {
            this.decksCount = _.keys(this.decks).length;
        }
    }
}
