var fs = require('fs');
var path = require('path');
var net = require('net');

module.exports = function (host, port, token, dir, cb) {
    var client = new net.Socket();
    var c = 0;
    var d = '';

    function msg(m) {
        client.write(JSON.stringify(m));
    }

    function end() {
        try {
            var o = JSON.parse(d);
            d = '';

            if (o.msg === 'ServerInfo') {
                msg({msg: 'CardTypes'});
            } else if (o.msg === 'CardTypes') {
                msg({msg: 'MarketplaceAvailableOffersListView'});
            }

            fs.writeFileSync(path.join(dir, (o.msg || c) + '.json'), JSON.stringify(o));
            c++;

            if (o.msg === 'MarketplaceAvailableOffersListView') {
                client.close();
            }
        } catch (ign) {
        }
    }

    client.on('data', function (data) {
        var r = data.toString();

        if (!r) {
            return;
        }

        if (!r.trim()) {
            return;
        }

        var p = r.split('\n');

        p.forEach(function (v) {
            d += v;
            end();
        });
    });

    client.on('close', cb);

    client.on('error', function(err) {
        //console.error(err);
    });

    client.connect(port, host, function () {
        msg({
            "accessToken": token,
            "msg": 'FirstConnect'
        });
    });
};
