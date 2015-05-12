var fs = require('fs');
var path = require('path');
var scrolls = require(path.join(__dirname, '..', 'scrolls.com.json'));

module.exports = function (src, cb) {
    fs.readdir(src, function (err, dirs) {
            var count = 0;

            function iteration() {
                if (count >= dirs.length) {
                    cb();
                    return;
                }

                var dir = dirs[count];
                count++;

                var p = Math.pow(10, scrolls.bundle[dir] || 3);

                function n(num) {
                    return (scrolls.bundle[dir] === 0) ? num : (Math.round(num * p) / p);
                }

                var animsPath = path.join(src, dir, 'anims.json');
                var spritesposPath = path.join(src, dir, 'spritespos.json');
                var anims = JSON.parse(fs.readFileSync(animsPath));
                var spritespos = JSON.parse(fs.readFileSync(spritesposPath));
                var obj = {
                    sprites: [],
                    animations: {}
                };

                spritespos.atlasItems.forEach(function (item) {
                    obj.sprites.push([
                        item.x,
                        item.y,
                        item.w,
                        item.h,
                        item.realW,
                        item.realH
                    ]);
                });

                anims.animations.forEach(function (anim) {
                    if ((anim.name !== 'idle') &&
                        (anim.name !== 'charge') &&
                        (anim.name !== 'attack') &&
                        (anim.name !== 'preattack')) {
                        return;
                    }

                    var frames = [];
                    obj.animations[anim.name] = frames;

                    var prevLookup = {};

                    anim.frames.forEach(function (frame) {
                        var fr = [];
                        var lookup = {};
                        frames.push(fr);

                        frame.parts.forEach(function (part) {
                            var a = [
                                part.meshId,
                                n(part.a),
                                n(part.b),
                                n(part.c),
                                n(part.d),
                                n(part.tx),
                                n(part.ty)
                            ];

                            if ((a[1] === 1) && (a[2] === 0) && (a[3] === 0) && (a[4] === 1)) {
                                a = [
                                    part.meshId,
                                    n(part.tx),
                                    n(part.ty)
                                ];
                            }

                            var na = null;
                            var overOptimized = false;

                            if (overOptimized) {
                                if (prevLookup[a[0]]) {
                                    var b = prevLookup[a[0]];

                                    if (a.length === b.length) {
                                        var eq = true;

                                        for (var i = 0; i < a.length; i++) {
                                            if (a[i] !== b[i]) {
                                                eq = false;
                                                break;
                                            }
                                        }

                                        if (eq) {
                                            console.log('unchanged');

                                            na = [
                                                part.meshId
                                            ];
                                        }
                                    }
                                }
                            }

                            lookup[a[0]] = a;
                            fr.push(na || a);
                        });

                        prevLookup = lookup;
                    });

                    if (!frames.length) {
                        delete obj.animations[anim.name];
                    }
                });


                obj.animations.attack = [].concat(
                    obj.animations.preattack || [],
                    obj.animations.charge || [],
                    obj.animations.attack || []
                );

                delete obj.animations.charge;
                delete obj.animations.preattack;

                if (!obj.animations.attack.length) {
                    delete obj.animations.attack;
                }

                var json = JSON.stringify(obj);
                var resPath = path.join(src, dir, 'data.json');
                fs.writeFileSync(resPath, json);

                iteration();
            }

            iteration();
        }
    )
    ;
};
