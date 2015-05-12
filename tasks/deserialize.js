var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

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

            var cmd = path.join(__dirname, 'scrolls-deserializer', 'scrolls-deserializer.exe');
            cmd += ' ' + path.join(src, dir, 'anims.bytes');
            cmd += ' ' + path.join(src, dir, 'anims.json');

            exec(cmd, function () {
                var cmd = path.join(__dirname, 'scrolls-deserializer', 'scrolls-deserializer.exe');
                cmd += ' ' + path.join(src, dir, 'spritespos.bytes');
                cmd += ' ' + path.join(src, dir, 'spritespos.json');

                exec(cmd, iteration);
            });
        }

        iteration();
    });
};
