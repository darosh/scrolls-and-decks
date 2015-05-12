(function () {
    'use strict';

    function UtilsPaging($timeout,
                   Config) {
        return {
            setNext: setNext,
            getPagingIteration: getPagingIteration
        };

        function setNext(self, params, filter) {
            if ((self.lazy.length < (params.limit - 5)) && self.lazy.length) {
                return false;
            }

            params.limit += 25;
            params.limit = (params.limit > filter.items.length) ? filter.items.length : params.limit;

            return true;
        }

        function getPagingIteration(self, filter, params, quickRepeatList) {
            var prevTime = (new Date()).getTime();

            function iteration() {
                if (params.si !== self.selectedIndex) {
                    return;
                }

                if ((self.lazy.length < params.limit) && (filter.items[self.lazy.length])) {
                    var e, t;

                    if (!self.lazy.length && quickRepeatList.items) {
                        quickRepeatList.items(self.lazy);
                    }

                    if (self.lazy.length < 20) {
                        e = self.lazy.length + 1;
                        t = Config.cardDelay;
                    } else {
                        e = self.lazy.length + 4;
                        e = (e > filter.items.length) ? filter.items.length : e;
                        t = Config.cardBatchDelay;
                    }

                    while (self.lazy.length < e) {
                        self.lazy.push(filter.items[self.lazy.length]);
                    }

                    var curTime = (new Date()).getTime();
                    var diffTime = curTime - prevTime;
                    prevTime = curTime;

                    if (diffTime > t) {
                        t = Config.cardMinDelay;
                    }

                    $timeout(function () {
                        params.running = false;

                        if (params.destroyed) {
                            return;
                        }

                        if (quickRepeatList.items) {
                            quickRepeatList.items(self.lazy);
                        }
                        iteration();
                    }, t);
                    params.running = true;
                } else {
                    params.running = false;
                }
            }

            return iteration;
        }
    }

    angular.module('app.services').factory('UtilsPaging', UtilsPaging);
})();
