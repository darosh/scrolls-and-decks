module.exports = function (config) {
    var paths = require('./gulp.conf.js');

    config.set({
        basePath: './',
        files: paths.scriptsLibs.src.concat([
            'node_modules/angular-mocks/angular-mocks.js',
            'bower_components/karma-read-json/karma-read-json.js',
            'client/app/shared/directives/app.directives.module.js',
            'client/types/*.js',
            'client/app/**/*.js',
            'tests/unit/**/*.spec.js',
            'client/app/**/*.html',
            {pattern: 'client/data/**/*.json', watched: true, served: true, included: false}
        ]),
        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: [
            'Firefox'
        ],
        plugins: [
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-coveralls',
            'karma-ng-html2js-preprocessor'
        ],
        junitReporter: {
            outputFile: 'reports/unit/unit.xml',
            suite: 'unit'
        },
        reporters: ['progress', 'coverage', 'junit']
            .concat(process.env.COVERALLS_REPO_TOKEN ? ['coveralls'] : []),
        preprocessors: {
            'client/app/**/*.js': ['coverage'],
            'client/app/**/*.html': ['ng-html2js']
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'reports/unit-coverage/'
        },
        htmlReporter: {
            outputFile: 'reports/unit/unit.html'
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/',
            moduleName: '__templates__'
        }
    });
};
