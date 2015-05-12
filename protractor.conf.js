exports.config = {
    specs: ['tests/e2e/*.spec.js'],
    multiCapabilities: [
        {
            browserName: 'firefox'
        }
    ],
    onPrepare: function () {
        global.collector = new (require('istanbul').Collector)();
    },
    onComplete: function () {
        var fs = require('fs');
        var mkp = require('mkdirp');
        var val = global.collector.getFinalCoverage();

        if (Object.keys(val).length) {
            var f = 'reports/e2e-coverage';
            mkp(f, function () {
                fs.writeFileSync(f + '/e2e-coverage.json', JSON.stringify(val));
                global.collector.dispose();
            });
        }
    }
};
