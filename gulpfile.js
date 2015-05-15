/*globals _:true */

'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var browserSync = {reload: $.util.noop};
var karma = require('karma').server;
var mkp = require('mkdirp');

// CONFIG

var RM = 'rev-manifest.json';

var cfg = {
    src: 'client',
    dest: argv.dest || 'build'
};

var paths = require('./gulp.conf.js');
var pkg = require('./package.json');

function version() {
    var s = pkg.version.split('.');
    s[2] = (parseInt(s[2]) + 1).toString();
    pkg.version = s.join('.');
    fs.writeFile('./package.json', JSON.stringify(pkg, null, 2), 'utf8');
}

_.each(paths, function (p) {
    _.each(p, function (v, k) {
        if (typeof v === 'string') {
            p[k] = _.template(v)(cfg);
        } else {
            _.each(v, function (a, b) {
                v[b] = _.template(a)(cfg);
            });
        }
    });

    p.dest = path.resolve(p.dest || '');
});

var analytics;

if (fs.existsSync('./analytics.js')) {
    analytics = fs.readFileSync('./analytics.js', 'utf8');
}

// CLEAN

gulp.task(
    'clean',
    ['clean:copy', 'clean:images', 'clean:data', 'clean:libs', 'clean:scripts', 'clean:styles',
        'clean:styles-libs', 'clean:templates', 'clean:index', 'clean:fonts', 'clean:temp'],
    function (done) {
        done();
    });

gulp.task('clean:copy', function (cb) {
    del(paths.copy.clean, cb);
});

gulp.task('clean:images', function (cb) {
    del(paths.images.dest, cb);
});

gulp.task('clean:data', function (cb) {
    del(paths.data.dest, cb);
});

gulp.task('clean:libs', function (cb) {
    del(paths.scriptsLibs.dest, cb);
});

gulp.task('clean:scripts', function (cb) {
    del(paths.scripts.dest, cb);
});

gulp.task('clean:styles', function (cb) {
    del(paths.styles.destSrc, cb);
});

gulp.task('clean:styles-libs', function (cb) {
    del(paths.stylesLibs.dest, cb);
});

gulp.task('clean:fonts', function (cb) {
    del(paths.fonts.dest, cb);
});

gulp.task('clean:templates', function (cb) {
    del([paths.templates.dest, paths.templates.html], cb);
});

gulp.task('clean:index', function (cb) {
    del(path.join(paths.index.dest, paths.index.tgt), cb);
});

gulp.task('clean:unit', function (cb) {
    del(['tests/output/*unit*'], cb);
});

gulp.task('clean:temp', function (cb) {
    del(['temp'], cb);
});

// BUILD

gulp.task('copy', ['clean:copy'], function () {
    return gulp.src(paths.copy.src)
        .pipe(gulp.dest(paths.copy.dest))
        .pipe($.size({title: 'copy'}));
});

gulp.task('copy:bundles', ['clean:data'], function () {
    return gulp.src(paths.copyBundles.src)
        .pipe(gulp.dest(paths.copyBundles.dest))
        .pipe($.size({title: 'copy:bundles'}));
});

gulp.task('libs', ['clean:libs'], function (cb) {
    var dest = paths.scriptsLibs.dest + '/*.*';

    function libs(err) {
        $.util.log('Bundling \'' + $.util.colors.cyan('libs') + '\'');

        if (err) {
            throw err;
        }

        if (argv.nomin) {
            gulp.src(paths.libs.src)
                .pipe($.angularFilesort())
                .pipe($.if(!argv.norev, $.rev()))
                .pipe(gulp.dest(paths.libs.dest))
                .on('end', cb)
                .pipe($.size({title: 'libs'}));
        } else {
            gulp.src(paths.scriptsLibs.src)
                //.pipe($.angularFilesort())
                .pipe($.if('*.min.js', $.uglify({compress: false, mangle: false}), $.uglify()))
                .pipe($.concat(paths.scriptsLibs.tgt))
                .pipe($.if(!argv.norev, $.rev()))
                .pipe(gulp.dest(paths.scriptsLibs.dest))
                .on('end', cb)
                .pipe($.size({title: 'libs'}));
        }
    }

    require('glob')(dest, function (err, matches) {
        if (((matches.length === 1) && !argv.nomin) || ((matches.length > 1) && argv.nomin)) {
            gulp.src(dest)
                .on('end', cb)
                .pipe($.size({title: 'reusing libs'}));
        } else {
            if (matches.length > 0) {
                $.util.log('Deleting \'' + $.util.colors.cyan('libs') + '\'');
                del(paths.libs.dest, libs);
            } else {
                libs();
            }
        }
    });
});

gulp.task('scripts', ['clean:scripts', 'data', 'images'], function () {
    if (argv.nomin) {
        return gulp.src([paths.scripts.jsTs, paths.scripts.src])
            .pipe($.if(argv.coverage, $.istanbul({coverageVariable: '__coverage__'})))
            .pipe($.angularFilesort())
            .pipe($.if(!argv.norev, $.rev()))
            .pipe(gulp.dest(paths.scripts.dest))
            .pipe($.size({title: 'scripts'}));

    } else {
        var md = !argv.norev ? JSON.parse(fs.readFileSync(path.join(paths.root.revData, RM)), 'utf8') : null;
        var mi = !argv.norev ? JSON.parse(fs.readFileSync(path.join(paths.root.revImages, RM), 'utf8')) : null;

        return gulp.src([paths.scripts.jsTs, paths.scripts.src])
            .pipe($.if(argv.coverage, $.istanbul({coverageVariable: '__coverage__'})))
            .pipe($.ngAnnotate())
            .pipe($.angularFilesort())
            .pipe($.uglifyjs(paths.scripts.tgt))
            .pipe($.if(!argv.norev, $.rev()))
            .pipe($.if(!argv.norev, $.replace('scrolls.json', md['scrolls.json'])))
            .pipe($.if(!argv.norev, $.replace('decks.json', md['decks.json'])))
            .pipe($.if(!argv.norev, $.replace('unitstand.png', mi['unitstand.png'])))
            .pipe($.replace('%VERSION%', pkg.version))
            .pipe($.replace('%BUILD%', (new Date()).toJSON()))
            .pipe(gulp.dest(paths.scripts.dest))
            .pipe($.size({title: 'scripts'}));
    }
});

gulp.task('templates', ['clean:templates', 'images'], function () {
    if (argv.nomin) {
        return gulp.src(paths.templates.src)
            .pipe(gulp.dest(paths.templates.html))
            .pipe($.size({title: 'templates'}));

    } else {
        var mi = !argv.norev ? JSON.parse(fs.readFileSync(path.join(paths.root.revImages, RM), 'utf8')) : null;

        return gulp.src(paths.templates.src)
            .pipe($.htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                keepClosingSlash: true,
                caseSensitive: true
            }))
            .pipe($.angularTemplatecache({
                root: paths.templates.root,
                module: paths.templates.module
            }))
            .pipe($.if(!argv.norev, $.rev()))
            .pipe($.if(!argv.norev, $.replace('resource_decay.svg', mi['resource_decay.svg'])))
            .pipe($.if(!argv.norev, $.replace('resource_energy.svg', mi['resource_energy.svg'])))
            .pipe($.if(!argv.norev, $.replace('resource_growth.svg', mi['resource_growth.svg'])))
            .pipe($.if(!argv.norev, $.replace('resource_order.svg', mi['resource_order.svg'])))
            .pipe($.if(!argv.norev, $.replace('resource_wild.svg', mi['resource_wild.svg'])))
            .pipe(gulp.dest(paths.templates.dest))
            .pipe($.size({title: 'templates'}));
    }
});

gulp.task('images', ['clean:images'], function () {
    var svgFilter = $.filter('*.svg');

    return gulp.src(paths.images.src)
        .pipe(svgFilter)
        .pipe($.if(!argv.nomin, $.imagemin()))
        .pipe(svgFilter.restore())
        .pipe($.if(!argv.norev, $.rev()))
        .pipe(gulp.dest(paths.images.dest))
        .pipe($.if(!argv.norev, $.rev.manifest()))
        .pipe(gulp.dest(paths.root.revImages));
});

gulp.task('data', ['clean:data'], function () {
    return gulp.src(paths.data.src)
        .pipe($.if(!argv.nomin, $.jsonminify()))
        .pipe($.if(!argv.norev, $.rev()))
        .pipe(gulp.dest(paths.data.dest))
        .pipe($.if(!argv.norev, $.rev.manifest()))
        .pipe(gulp.dest(paths.root.revData));
});

gulp.task('styles', ['clean:styles', 'images'], function () {
    var mi = !argv.norev ? JSON.parse(fs.readFileSync(path.join(paths.root.revImages, RM), 'utf8')) : {};

    return gulp.src(paths.styles.src)
        .pipe($.if(!argv.norev, $.rev()))
        .pipe($.if(!argv.nomin, $.concat('styles.css')))
        .pipe($.csso())

        .pipe($.if(!argv.norev, $.replace('scrolls_l_d.jpg', mi['scrolls_l_d.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_e.jpg', mi['scrolls_l_e.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_g.jpg', mi['scrolls_l_g.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_o.jpg', mi['scrolls_l_o.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_d.jpg', mi['scrolls_m_d.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_e.jpg', mi['scrolls_m_e.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_g.jpg', mi['scrolls_m_g.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_o.jpg', mi['scrolls_m_o.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_d.jpg', mi['scrolls_s_d.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_e.jpg', mi['scrolls_s_e.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_g.jpg', mi['scrolls_s_g.jpg'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_o.jpg', mi['scrolls_s_o.jpg'])))

        .pipe($.if(!argv.norev, $.replace('scrolls_l_d.webp', mi['scrolls_l_d.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_e.webp', mi['scrolls_l_e.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_g.webp', mi['scrolls_l_g.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_l_o.webp', mi['scrolls_l_o.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_d.webp', mi['scrolls_m_d.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_e.webp', mi['scrolls_m_e.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_g.webp', mi['scrolls_m_g.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_m_o.webp', mi['scrolls_m_o.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_d.webp', mi['scrolls_s_d.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_e.webp', mi['scrolls_s_e.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_g.webp', mi['scrolls_s_g.webp'])))
        .pipe($.if(!argv.norev, $.replace('scrolls_s_o.webp', mi['scrolls_s_o.webp'])))

        .pipe($.if(!argv.norev, $.rev()))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe($.size({title: 'styles'}))
        .pipe($.if(argv.norev && browserSync.active, browserSync.reload({stream: true})));
});

gulp.task('styles-libs', ['clean:styles-libs', 'clean:fonts'], function () {
    var styleFilter = $.filter('*.css');
    var fontFilter = $.filter(paths.fonts.type);

    return gulp.src(paths.stylesLibs.src.concat(paths.fonts.src))
        .pipe(fontFilter)
        .pipe($.if(!argv.norev, $.rev()))
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe($.size({title: 'fonts'}))
        .pipe(fontFilter.restore())
        .pipe($.if(!argv.norev, $.revReplace()))
        .pipe($.if(!argv.norev, $.rev()))
        .pipe(styleFilter)
        .pipe($.replace('url(\'fonts/', 'url(\'../fonts/'))
        .pipe($.csso())
        .pipe(gulp.dest(paths.stylesLibs.dest))
        .pipe($.size({title: 'styles-libs'}));
});

function injectIndex() {
    function inject(glob, path, tag, script) {
        return $.inject(
            gulp.src(glob, {cwd: path})
                .pipe($.if(tag === 'scripts', $.angularFilesort())),
            {
                addRootSlash: false,
                starttag: '<!-- inject:' + tag + ':{{ext}} -->',
                transform: script && function (filepath, file) {
                    return '<script>' + file.contents.toString('utf8') + '</script>';
                }
            }
        );
    }

    function allFiles(p) {
        if (typeof p === 'string') {
            return path.join(p, '/**/*.*');
        } else {
            return _.map(p, function (p) {
                return path.resolve(p);
            });
        }
    }

    function index(p) {
        var mi = !argv.norev ? JSON.parse(fs.readFileSync(path.join(paths.root.revImages, RM), 'utf8')) : null;

        return gulp.src(paths.index.src)
            .pipe(inject(allFiles(paths.stylesLibs.dest), p, 'libs'))
            .pipe(inject(allFiles(paths.styles.dest), p, 'style'))
            .pipe(inject(allFiles(paths.scriptsLibs.dest), p, 'libs'))
            .pipe(inject(allFiles(paths.scripts.dest), p, 'scripts'))
            .pipe(inject(allFiles(paths.templates.dest), p, 'templates'))
            .pipe($.if(!argv.norev, $.replace('logo.png', mi['logo.png'])))
            .pipe($.replace('<!-- inject:style:analytics --><!-- endinject -->', '<script>' + analytics + '</script>'))
            .pipe($.if(!argv.nomin, $.htmlmin({removeComments: true, collapseWhitespace: true, minifyJS: true})))
            .pipe(gulp.dest(p));
    }

    return index(paths.index.dest);
}

gulp.task('jshint', function () {
    if (argv.nolint) {
        $.util.log('Skipping \'' + $.util.colors.cyan('jshint') + '\'');
    } else {
        return gulp.src([paths.scripts.src, 'gulpfile.js'])
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
    }
});

gulp.task('tslint', function () {
    gulp.src(paths.scripts.ts)
        .pipe($.tslint())
        .pipe($.tslint.report('verbose'));
});

gulp.task('jscs', function () {
    return gulp.src([paths.scripts.src, 'gulpfile.js'])
        .pipe($.jscs());
});

gulp.task('eslint', function () {
    return gulp.src([paths.scripts.src])
        .pipe($.eslint())
        .pipe($.eslint.format());
});

gulp.task('version', function (cb) {
    version();
    cb();
});

gulp.task('build', ['version', 'copy', 'images', 'copy:bundles', 'data', 'libs', 'images', 'jshint', 'jscs', 'tslint', 'scripts',
    'templates', 'styles', 'styles-libs', 'sloc'], function () {
    return injectIndex();
});

var duration = $.duration('build');

gulp.task('default', ['build'], function () {
    if (argv.size) {
        return gulp.src(paths.root.all)
            .pipe($.size({title: 'all', showFiles: true}))
            .pipe(duration);
    } else if (argv['size-gzip']) {
        return gulp.src(paths.root.all)
            .pipe($.size({title: 'all', showFiles: true, gzip: true}))
            .pipe(duration);
    } else {
        return gulp.src('')
            .pipe(duration);
    }
});

gulp.task('inject-index', function () {
    return injectIndex();
});

// TEST

gulp.task('unit', ['clean:unit'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function () {
        done();
    });
});

var child_process = require('child_process');

function getProtractorBinary(binaryName) {
    //var winExt = /^win/.test(process.platform) ? '.cmd' : '';
    var pkgPath = require.resolve('protractor');
    var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
    return path.join(protractorDir, '/' + binaryName);
}

gulp.task('protractor-install', function (done) {
    console.log(getProtractorBinary('webdriver-manager'));

    child_process.spawn('node', [getProtractorBinary('webdriver-manager'), 'update'], {
        stdio: 'inherit'
    }).once('close', done);
});

gulp.task('e2e', ['protractor-install', 'serve'], function (done) {
    child_process.spawn('node', [getProtractorBinary('protractor')], {
        stdio: 'inherit'
    }).once('close', function () {
        function end() {
            browserSync.exit();
            done();
        }

        if (argv.coverage) {
            fs.readFile('./reports/e2e-coverage/e2e-coverage.json', {encoding: 'utf8'}, function (err, val) {
                global.__coverage__ = JSON.parse(val);

                gulp.src('./build/scripts/**/*.js')
                    .pipe($.istanbul.writeReports({
                        dir: './reports/e2e-coverage',
                        coverageVariable: '__coverage__'
                    })).on('end', end);
            });
        } else {
            end();
        }
    });
});

gulp.task('test', ['jshint', 'tslint', 'jscs', 'eslint', 'unit', 'e2e']);

// SERVE

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('serve', !argv.nobuild ? ['build'] : [], function () {
    if ((argv._.indexOf('e2e') > -1) || (argv._.indexOf('test') > -1)) {
        argv.noopen = true;
    }

    browserSync = require('browser-sync');

    browserSync({
        server: {
            baseDir: cfg.dest
        },
        port: argv.port || 8888,
        open: !argv.noopen
    }, function () {
        setTimeout(
            function () {
                if (!argv.norev && !argv.nomin) {
                    browserSync.notify('Using <b>PRODUCTION</b> build', 3000);
                }
            },
            3000);
    });

    function msg() {
        version();
        browserSync.notify('Rebuilding&hellip;');
    }

    if (!argv.nowatch) {
        gulp.watch([paths.styles.destSrc], function () {
            msg();

            if (argv.norev) {
                runSequence('styles');
            } else {
                runSequence('styles', 'inject-index', 'reload');
            }
        });

        gulp.watch([paths.templates.src], function () {
            msg();
            runSequence('templates', 'inject-index', 'reload');
        });

        gulp.watch([paths.scripts.src, 'gulpfile.js'], function () {
            msg();
            runSequence('scripts', 'inject-index', 'reload', 'jshint');
        });
    }
});

// DRY

gulp.task('dry:output', function (cb) {
    mkp('reports/dry/', cb);
});

gulp.task('dry:js', ['dry:output'], function () {
    return gulp.src(paths.scripts.src)
        .pipe($.jscpd({
            verbose: true,
            output: 'reports/dry/dry.js.xml'
        }));
});

gulp.task('dry:css', ['dry:output'], function () {
    return gulp.src(paths.styles.src)
        .pipe($.jscpd({
            verbose: true,
            output: 'reports/dry/dry.css.xml'
        }));
});

gulp.task('dry:html', ['dry:output'], function () {
    return gulp.src(paths.templates.src)
        .pipe($.jscpd({
            verbose: true,
            output: 'reports/dry/dry.html.xml'
        }));
});

gulp.task('dry', ['dry:js', 'dry:css', 'dry:html']);

// PLATO

gulp.task('plato', function (cb) {
    var plato = require('plato');

    plato.inspect(paths.scripts.src, './reports/plato', {}, function () {
        cb();
    });
});

// DOC

gulp.task('typedoc', function () {
    return gulp
        .src(paths.scripts.ts)
        .pipe($.typedoc({
            module: 'commonjs',
            out: './reports/typedoc',
            name: 'scrolls-and-decks',
            target: 'es5',
            mode: 'modules',
            includeDeclarations: true
        }));
});

gulp.task('chart:all', function () {
    gulp.src(paths.scripts.src)
        .pipe($.angularArchitectureGraph({
            dest: 'reports/chart-all',
            hideAngularServices: false
        }));
});

gulp.task('chart:app', function () {
    gulp.src([paths.scripts.src])
        .pipe($.angularArchitectureGraph({
            dest: 'reports/chart-app',
            hideAngularServices: true
        }));
});

gulp.task('chart', ['chart:all', 'chart:app']);

gulp.task('sloc:js', function () {
    return gulp.src(paths.scripts.src)
        .pipe($.sloc({
            reportType: 'json',
            reportFile: 'sloc.js.json'
        }))
        .pipe(gulp.dest('temp/sloc'));
});

gulp.task('sloc:ts', function () {
    return gulp.src(paths.scripts.ts)
        .pipe($.sloc({
            tolerant: true,
            reportType: 'json',
            reportFile: 'sloc.ts.json'
        }))
        .pipe(gulp.dest('temp/sloc'));
});

gulp.task('sloc:test', function () {
    return gulp.src(['tests/e2e/**/*.js', 'tests/unit/**/*.js'])
        .pipe($.sloc({
            reportType: 'json',
            reportFile: 'sloc.test.json'
        }))
        .pipe(gulp.dest('temp/sloc'));
});

gulp.task('sloc:css', function () {
    return gulp.src(paths.styles.src)
        .pipe($.sloc({
            tolerant: true,
            reportType: 'json',
            reportFile: 'sloc.css.json'
        }))
        .pipe(gulp.dest('temp/sloc'));
});

gulp.task('sloc:html', function () {
    return gulp.src([paths.templates.src, paths.index.src])
        .pipe($.sloc({
            tolerant: true,
            reportType: 'json',
            reportFile: 'sloc.html.json'
        }))
        .pipe(gulp.dest('temp/sloc'));
});

gulp.task('sloc', ['sloc:js', 'sloc:ts', 'sloc:test', 'sloc:css', 'sloc:html'], function (cb) {
    var css = require('./temp/sloc/sloc.css.json');
    var js = require('./temp/sloc/sloc.js.json');
    var ts = require('./temp/sloc/sloc.ts.json');
    var test = require('./temp/sloc/sloc.test.json');
    var html = require('./temp/sloc/sloc.html.json');

    function num(n) {
        return n < 1000 ? n : Math.round(n / 100) / 10 + 'k';
    }

    var tg = 'README.md';
    var rm = fs.readFileSync(tg, 'utf8');

    rm = rm
        .replace(/:sloc js-[^-]+-/, ':sloc js-' + num(js.sloc) + '-')
        .replace(/:sloc ts-[^-]+-/, ':sloc ts-' + num(ts.sloc) + '-')
        .replace(/:sloc test-[^-]+-/, ':sloc test-' + num(test.sloc) + '-')
        .replace(/:sloc html-[^-]+-/, ':sloc html-' + num(html.sloc) + '-')
        .replace(/:sloc css-[^-]+-/, ':sloc css-' + num(css.sloc) + '-');

    fs.writeFileSync(tg, rm);

    cb();
});

// DEPLOY

gulp.task('deploy', !argv.nobuild ? ['build'] : [], function () {
    return gulp.src('./build/**/*')
        .pipe($.ghPages({message: pkg.version, cacheDir: 'temp/publish'}));
});

// SCROLLS

gulp.task('scrolls:data:load', function (cb) {
    var ct = './temp/scrolls/input/data/CardTypes.json';

    fs.exists(ct, function (exists) {
        if (exists) {
            cb();
        } else {

            var ld = require('./tasks/load-data');
            var cf = require('./scrolls.com.json');
            var d = 'temp/scrolls/input/data';
            mkp(d, function () {
                ld(cf.host, cf.port, cf.token, d, function () {
                    cb();
                });
            });
        }
    });
});

gulp.task('scrolls:images:load', ['scrolls:data:load'], function (cb) {
    var li = require('./tasks/load-images');
    var cf = require('./scrolls.com.json');
    var ct = require('./temp/scrolls/input/data/CardTypes.json');
    var sd = './temp/scrolls/input/images-in';
    var td = './temp/scrolls/input/images-out';
    mkp(sd, function () {
        mkp(td, function () {
            li(ct.cardTypes, cf.images, sd, td, cb);
        });
    });
});

gulp.task('scrolls:data:build', ['scrolls:images:load'], function (cb) {
    var bd = require('./tasks/build-data');
    var cardTypesFile = './temp/scrolls/input/data/CardTypes.json';
    var cardTypes = require(cardTypesFile);
    var mappedStrings = require('./temp/scrolls/input/data/MappedStrings.json');
    var prices = require('./temp/scrolls/input/data/MarketplaceAvailableOffersListView.json');
    var server = require('./temp/scrolls/input/data/ServerInfo.json');
    var imgSrc = './temp/scrolls/input/images-out';
    var imgTgt = './temp/scrolls/input/images-res';
    var ot = 'temp/scrolls/output/data';
    var otd = ot + '/scrolls.json';
    var date = (new Date(fs.statSync(cardTypesFile).mtime));
    mkp(ot, function () {
        var d = bd(cardTypes, mappedStrings, prices, server, date, imgSrc, imgTgt);
        fs.writeFile(otd, JSON.stringify(d, null, 2), cb);
    });
});

gulp.task('scrolls:images:build', ['scrolls:data:build'], function (cb) {
    var cmd = path.resolve('./tasks/build-images.cmd');
    mkp('./temp/scrolls/input/images-merged', function () {
        mkp('./temp/scrolls/output/images', function () {
            require('child_process').exec(cmd, cb);
        });
    });
});

gulp.task('scrolls:bundles:deserialize', function (cb) {
    var bd = require('./tasks/deserialize.js');
    bd('./temp/scrolls/input/bundles-in', cb);
});

gulp.task('scrolls:bundles:build', function (cb) {
    var bd = require('./tasks/build-bundles.js');
    bd('./temp/scrolls/input/bundles-in', cb);
});

gulp.task('scrolls:bundles:copy:images', function () {
    var pngquant = require('./node_modules/gulp-imagemin/node_modules/imagemin/node_modules/imagemin-pngquant');

    return gulp.src('./temp/scrolls/input/bundles-in/*/sprites.png')
        .pipe(pngquant({quality: '65-80', speed: 1, nofs: false})())
        .pipe(gulp.dest('client/data/bundles'));
});

gulp.task('scrolls:bundles:copy:data', function () {
    return gulp.src('./temp/scrolls/input/bundles-in/*/data.json')
        .pipe(gulp.dest('client/data/bundles'));
});

gulp.task('scrolls', ['scrolls:images:build']);
