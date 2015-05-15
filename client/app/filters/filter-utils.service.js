(function () {
    'use strict';

    function FilterUtils($timeout, $q) {
        var resources = 'geod';
        var costs = '12345678';
        var dummy = {
            text: {},
            params: {}
        };

        return {
            toParams: toParams,
            fromParams: fromParams,
            query: getQuery,
            setFilter: setFilter,
            filterParams: filterParams,
            setResource: setResource,
            setCost: setCost,
            resources: {
                g: true,
                e: true,
                o: true,
                d: true
            },
            costs: {
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true,
                7: true,
                8: true
            },
            dummy: dummy
        };

        function setResource(self) {
            return function (r, event) {
                var n = self.params[r];

                if (event && (event.ctrlKey || event.altKey)) {
                    self.params.g = n;
                    self.params.e = n;
                    self.params.o = n;
                    self.params.d = n;
                }

                self.params[r] = !n;
            };
        }

        function setCost(self) {
            return function (r, event) {
                var n = self.params[r];

                if (event && (event.ctrlKey || event.altKey)) {
                    self.params[1] = n;
                    self.params[2] = n;
                    self.params[3] = n;
                    self.params[4] = n;
                    self.params[5] = n;
                    self.params[6] = n;
                    self.params[7] = n;
                    self.params[8] = n;
                }

                self.params[r] = !n;
            };
        }

        function filterParams(t, name, r) {
            var o = angular.copy(dummy);
            var sf = setFilter(o);
            sf(t, name, r);
            return toParams(o);
        }

        function fromParams(params, self) {
            angular.forEach(params, function (v, k) {
                params[k] = decodeURIComponent(decodeURIComponent(v));
            });

            var r = (params.resources === 'none') ? '' : (!params.resources ? resources : params.resources);
            var c = (params.costs === 'none') ? '' : (!params.costs ? costs : params.costs);

            angular.forEach(resources, function (v) {
                self.params[v] = _.indexOf(r, v) > -1;
            });

            angular.forEach(costs, function (v) {
                self.params[v] = _.indexOf(c, v) > -1;
            });

            self.params.star = params.star || 0;

            self.text.search = params.search || '';

            self.params.selectedItem = null;

            if (!params.search) {
                angular.forEach(params, function (v, k) {
                    if (k !== 'resources' && k !== 'costs' && k !== 'star' && k !== 'search' && v) {
                        self.params.selectedItem = {};
                        self.params.selectedItem.name = (k === 'set') ? ('Set ' + v) : v;
                        self.params.selectedItem[k] = (k === 'set') ? parseInt(v) : true;
                        self.text.search = self.params.selectedItem.name;
                    }
                });
            }
        }

        function toParams(self) {
            var r = 0;
            var c = 0;
            var ret = {
                resources: null,
                costs: null,
                star: null,
                search: null,
                kind: null,
                type: null,
                trait: null,
                rarity: null,
                set: null
            };

            angular.forEach(resources, function (v) {
                r += self.params[v];
            });

            angular.forEach(costs, function (v) {
                c += self.params[v];
            });

            if (r === 0) {
                ret.resources = 'none';
            } else if (r < 4) {
                ret.resources = '';
                angular.forEach(resources, function (v) {
                    ret.resources += self.params[v] ? v : '';
                });
            }

            if (c === 0) {
                ret.costs = 'none';
            } else if (c < 8) {
                ret.costs = '';
                angular.forEach(costs, function (v) {
                    ret.costs += self.params[v] ? v : '';
                });
            }

            if (self.params.star) {
                ret.star = self.params.star;
            }

            if (self.params.selectedItem) {
                angular.forEach(self.params.selectedItem, function (v, k) {
                    if (v === true) {
                        ret[k] = self.params.selectedItem.name;
                    }
                });

                ret.set = self.params.selectedItem.set || null;
            } else if (self.text.search) {
                ret.search = self.text.search;
            }

            return ret;
        }

        function getQuery(self, sorted, stats) {
            return function (query) {
                if (!query || self.disabled) {
                    return [];
                }

                if (self.params.selectedItem && (self.params.selectedItem.name === query)) {
                    return [self.params.selectedItem];
                }

                sorted = sorted || self.sorted;
                stats = stats || self.stats;

                query = query.toLowerCase();

                var deferred = $q.defer();

                $timeout(function () {
                    var a = [];
                    var b = [];

                    var k = ['CREATURE', 'ENCHANTMENT', 'SPELL', 'STRUCTURE'];
                    var r = ['Common', 'Uncommon', 'Rare'];

                    var ck = [];
                    var ct = [];
                    var ci = [];
                    var cr = [];
                    var ss = [];

                    var sets = {};

                    _.each(k, function (c) {
                        var i = c.toLowerCase().indexOf(query);

                        if (i === 0) {
                            ck.push({name: c, kind: true});
                        }
                    });

                    _.each(r, function (c) {
                        var i = c.toLowerCase().indexOf(query);

                        if (i === 0) {
                            ck.push({name: c, rarity: true});
                        }
                    });

                    if (stats && stats.type) {
                        _.each(stats.type.total, function (v) {
                            //if (!v[0]) {
                            //    return;
                            //}

                            var i = v[0].toLowerCase().indexOf(query);

                            if (i === 0) {
                                ct.push({name: v[0], type: true});
                            }
                        });
                    }

                    if (stats && stats.trait) {
                        _.each(stats.trait.total, function (v) {
                            var i = v[0].toLowerCase().indexOf(query);

                            if (i === 0) {
                                ci.push({name: v[0], trait: true});
                            }
                        });
                    }

                    _.each(sorted, function (c) {
                        var i = c.s.nameLowerCase.indexOf(query);

                        sets[c.s.set] = true;

                        if (i === -1) {
                            return;
                        }

                        if (i === 0) {
                            a.push({name: c.s.name, card: c});
                        } else {
                            b.push({name: c.s.name, card: c});
                        }
                    });

                    _.each(sets, function (v, kk) {
                        var n = 'Set ' + kk;
                        var i = n.toLowerCase().indexOf(query);

                        if (i > -1) {
                            ss.push({name: n, set: parseInt(kk)});
                        }
                    });

                    a = _.sortBy(a, 'name');
                    b = _.take(_.sortBy(b, 'name'), (b.length < 25) ? b.length : 25);

                    var res = ss.concat(ck).concat(cr).concat(ct).concat(ci).concat(a).concat(b);
                    deferred.resolve(res);
                });

                return deferred.promise;
            };
        }

        function setFilter(self) {
            return function (t, name, r) {
                var cost = 0;

                name = _.isNumber(name) ? (name !== 0 ? name.toString() : name) : name;

                if (t === 'cost') {
                    cost = name;
                    self.params.selectedItem = null;
                    self.text.search = null;
                } else if (t === '?') {
                    self.text.search = name || '';
                } else {
                    var v = {name: name};

                    if (t) {
                        v[t] = true;
                        self.params.selectedItem = v;
                    }

                    self.text.search = name || '';

                    if (t === 'set' && name) {
                        self.text.search = v.name = 'Set ' + name;
                        v[t] = parseInt(name);
                    }
                }

                for (var i = 1; i <= 8; i++) {
                    self.params[i] = !cost || (cost === i.toString());
                }

                r = r || 'total';

                self.params.g = (r === 'r0') || (r === 'total');
                self.params.e = (r === 'r1') || (r === 'total');
                self.params.o = (r === 'r2') || (r === 'total');
                self.params.d = (r === 'r3') || (r === 'total');

                if (angular.isUndefined(t)) {
                    self.params.star = 0;
                }
            };
        }
    }

    angular.module('app.filters').factory('FilterUtils', FilterUtils);
})();
