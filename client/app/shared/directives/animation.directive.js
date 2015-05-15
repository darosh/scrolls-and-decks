(function () {
    'use strict';

    function appAnimation($resource, $q, $document, $window) {
        var standDeferred = $q.defer();
        var standImg = new $window.Image();
        standImg.src = 'images/unitstand.png';
        standDeferred.img = standImg;
        standImg.onload = function () {
            standDeferred.resolve(standDeferred);
        };

        return {
            link: link,
            scope: {
                appAnimation: '='
            }
        };

        function link(scope, element, attrs) {
            var canvas = $document[0].createElement('canvas');

            var zoom = 1; //0.88;
            var shift = 0; //-8;

            canvas.width = 530 * zoom;
            canvas.height = 490 * zoom;
            element.append(canvas);
            var attack = false;
            var attacking = false;

            //noinspection JSUnresolvedVariable
            if (!attrs.appAnimationNoClick) {
                element.bind('click', function () {
                    attack = isAnimated();
                });
            }

            function elementInViewport(el) {
                var rect = el.getBoundingClientRect();

                return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= ($window.innerHeight || $document.documentElement.clientHeight) &&
                rect.right <= ($window.innerWidth || $document.documentElement.clientWidth)
                );
            }

            function isAnimated() {
                return scope.$parent && scope.$parent.toolbarCtrl && scope.$parent.toolbarCtrl.settingsCopy.animate;
            }

            function update() {
                //noinspection JSUnresolvedVariable
                if (!attrs.appAnimationNoClick) {
                    element.removeClass('app-animation-can-attack');
                }

                element.removeClass('app-wait');

                var ctx = canvas.getContext('2d');
                //ctx.resetTransform();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                standDeferred.promise.then(function () {
                    clearFrame();
                });

                if (!scope.appAnimation) {
                    return;
                }

                attack = false;
                attacking = false;

                var id = scope.appAnimation;
                var spritesImg = new $window.Image();
                var data;

                $window.setTimeout(function () {
                    data = $resource('data/bundles/' + id + '/data.json', {}, {get: {method: 'GET', cache: true}}).get();
                    var deferred = $q.defer();

                    spritesImg.src = 'data/bundles/' + id + '/sprites.png';
                    spritesImg.onload = function () {
                        deferred.img = spritesImg;
                        deferred.resolve(deferred);
                    };

                    $q.all([data.$promise, standDeferred.promise, deferred.promise]).then(function () {
                        $window.setTimeout(ready, 0);
                    });
                }, 0);

                function ready() {
                    var fps = 24;
                    var firstFrameTime = null;

                    //noinspection JSUnresolvedVariable
                    if (!attrs.appAnimationNoClick && data.animations.attack) {
                        element.addClass('app-animation-can-attack');
                    }

                    function animate(cid) {
                        /*eslint-disable angular/ng_no_private_call*/
                        if (scope.$$destroyed || (cid !== scope.appAnimation)) {
                            return;
                        }
                        /*eslint-enable angular/ng_no_private_call*/

                        $window.requestAnimationFrame(function () {
                            /*eslint-disable angular/ng_no_private_call*/
                            if (scope.$$destroyed || (cid !== scope.appAnimation)) {
                                return;
                            }
                            /*eslint-enable angular/ng_no_private_call*/

                            var time = (new Date()).getTime();

                            //noinspection JSUnresolvedVariable
                            var haveAttack = attack && !!data.animations.attack;
                            //noinspection JSUnresolvedVariable
                            var animation = haveAttack ? data.animations.attack : data.animations.idle;

                            if (!firstFrameTime) {
                                firstFrameTime = time;
                            }

                            if (haveAttack && !attacking) {
                                firstFrameTime = time;
                                attacking = true;
                                element.addClass('app-wait');
                            }

                            var elapsed = Math.round((time - firstFrameTime) / (1000 / fps));

                            if ((elapsed >= animation.length) && attacking) {
                                firstFrameTime = time;
                                //noinspection JSUnresolvedVariable
                                animation = data.animations.idle;
                                attacking = false;
                                attack = false;
                                elapsed = 0;
                                element.removeClass('app-wait');
                            }

                            var animated = isAnimated() && hasNoBackdrop();
                            var inView = elementInViewport(canvas);
                            var delay = (animated && inView) ? (1000 / 30) : (1000 / 3);
                            var frame = elapsed % animation.length;

                            if (inView || (elapsed === 0)) {
                                if ((frame !== previousFrame) && (animated || previousFrame === null)) {
                                    previousFrame = frame;
                                    renderFrame(animation[frame]);
                                }
                            }

                            $window.setTimeout(function () {
                                animate(cid);
                            }, delay);
                        });
                    }

                    var previousFrame = null;

                    animate(id);
                }

                function hasNoBackdrop() {
                    var bs = $document[0].getElementsByTagName('md-backdrop');

                    if (!bs.length) {
                        return true;
                    } else {
                        var f = _.find(bs, function (b) {
                            return $window.getComputedStyle(b).display !== 'none';
                        });

                        return !f;
                    }
                }

                function renderPart(part) {
                    if (part.length === 3) {
                        part.splice(1, 0, 1, 0, 0, 1);
                    }

                    var s = data.sprites[part[0]];
                    var e = 264 * zoom + part[5] / (s[4] / s[2]);
                    var f = 270 * zoom + shift + part[6] / (s[5] / s[3]);
                    ctx.setTransform(part[1], part[2], part[3], part[4], e, f);
                    ctx.drawImage(spritesImg, s[0], s[1], s[2], s[3], 0, 0, s[2], s[3]);
                }

                function isDark() {
                    return scope.$parent && scope.$parent.toolbarCtrl && scope.$parent.toolbarCtrl.settingsCopy.dark;
                }

                function clearFrame() {
                    //ctx.resetTransform();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var w = standImg.width * 0.58;
                    var h = standImg.height * 0.58;
                    ctx.globalAlpha = attacking ? (isDark() ? 0.55 : 0.32) : (isDark() ? 0.28 : 0.18);
                    ctx.drawImage(standImg, 0, 0, standImg.width, standImg.height, (canvas.width - w) / 2, 328 * zoom + shift, w, h);
                    ctx.globalAlpha = 1;
                }

                function renderFrame(frame) {
                    clearFrame();
                    angular.forEach(frame, renderPart);
                }
            }

            scope.$watch('appAnimation', update);
        }
    }

    angular.module('app.directives').directive('appAnimation', appAnimation);
})();
