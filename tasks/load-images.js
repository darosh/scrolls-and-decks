var fs = require('fs');
var path = require('path');
var request = require('request');

module.exports = function (ct, address, sd, td, cb) {
    var is = {};

    ct.forEach(function (v) {
        is[v.cardImage] = true;
    });

    var i = 0;

    function iteration() {
        if (i === ct.length) {
            cb();
            return;
        }

        var sp = path.join(sd, ct[i].cardImage + '.png');
        var tp = path.join(td, ct[i].cardImage + '.png');
        var url = address + ct[i].cardImage;

        i++;

        fs.exists(sp, function (exists) {
            if (exists) {
                fs.rename(sp, tp, function () {
                    iteration();
                });
            } else {
                fs.exists(tp, function (exists) {
                    if (exists) {
                        iteration();
                    } else {
                        console.log('download', url);

                        request(url, iteration).pipe(fs.createWriteStream(tp))
                    }
                });
            }
        });
    }

    iteration();
};
