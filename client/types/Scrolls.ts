/// <reference path="Scroll.ts" />

module ScrollsTypes {
    'use strict';

    export class Scrolls {
        parsed:Scroll[] = [];
        look:{[index: number]: Scroll} = {};
        kinds:{[index: number]: {[index:string]: Scroll[]}} = {};
        types:{[index: number]: {[index:string]: Scroll[]}} = {};
        modified:Date;
        version:string;

        static initResources(o:any):void {
            o[Resource[Resource.g]] = {};
            o[Resource[Resource.e]] = {};
            o[Resource[Resource.o]] = {};
            o[Resource[Resource.d]] = {};
        }

        constructor(data:any, webp:boolean = false) {
            this.modified = new Date(data.modified);
            this.version = data.version;

            Scrolls.initResources(this.kinds);
            Scrolls.initResources(this.types);

            data.types.forEach((type:any) => {
                var s:Scroll = new Scroll(type, data, webp);

                this.parsed.push(s);
                this.look[s.id] = s;

                this.kinds[s.r][s.kind] = this.kinds[s.r][s.kind] || [];
                this.kinds[s.r][s.kind].push(s);

                s.typesArr.forEach((t:string) => {
                    this.types[s.r][t] = this.types[s.r][t] || [];
                    this.types[s.r][t].push(s);
                });
            });
        }
    }
}
