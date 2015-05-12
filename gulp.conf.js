module.exports = {
    root: {
        dest: '<%= dest %>',
        all: '<%= dest %>/**/*.*',
        revImages: './temp/images',
        revData: './temp/data',
        temp: '<%= dest %>/../temp'
    },
    copy: {
        src: [
            '<%= src %>/*.{ico,js}',
            '<%= src %>/.gitattributes'
        ],
        dest: '<%= dest %>',
        clean: [
            '<%= dest %>/*.{ico,js}'
        ]
    },
    copyBundles: {
        src: [
            '<%= src %>/data/bundles/*/*.{json,png}'
        ],
        dest: '<%= dest %>/data/bundles'
    },
    scriptsLibs: {
        dest: '<%= dest %>/scripts-libs',
        tgt: 'libs.js',
        src: [
            './bower_components/lodash/lodash.min.js',
            './bower_components/angular/angular.min.js',
            './bower_components/angular-aria/angular-aria.min.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angular-resource/angular-resource.min.js',
            './bower_components/angular-messages/angular-messages.min.js',
            './bower_components/angular-sanitize/angular-sanitize.min.js',
            './bower_components/angular-material/angular-material.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
            './bower_components/ngstorage/ngStorage.min.js',
            './bower_components/quick-ng-repeat/quick-ng-repeat.js',
            './bower_components/angulartics/dist/angulartics.min.js',
            './bower_components/angulartics/dist/angulartics-ga.min.js',
            './bower_components/screenfull/dist/screenfull.js'
        ],
        order: [
            '<%= dest %>/libs/lodash.min*.js',
            '<%= dest %>/libs/angular.min*.js',
            '<%= dest %>/libs/angular-material.min*.js',
            '<%= dest %>/libs/*.js'
        ]
    },
    scripts: {
        dest: '<%= dest %>/scripts',
        tgt: 'scripts.js',
        src: '<%= src %>/app/**/*.js',
        ts: '<%= src %>/types/*.ts',
        jsTs: '<%= src %>/types/*.js'
    },
    templates: {
        dest: '<%= dest %>/templates',
        html: '<%= dest %>/views',
        src: '<%= src %>/app/**/*.html',
        root: 'app/',
        module: 'app'
    },
    styles: {
        dest: '<%= dest %>/styles',
        destSrc: '<%= dest %>/styles/*.css',
        src: [
            '<%= src %>/styles/**/*.css'
        ]
    },
    stylesLibs: {
        dest: '<%= dest %>/styles-libs',
        destSrc: '<%= dest %>/styles-libs/*.css',
        src: [
            './bower_components/roboto-fontface/css/roboto-fontface.css',
            './bower_components/mdi/css/materialdesignicons.min.css',
            './bower_components/angular-material/angular-material.min.css'
        ]
    },
    fonts: {
        dest: '<%= dest %>/fonts',
        src: [
            './bower_components/mdi/fonts/**/*.*',
            './bower_components/roboto-fontface/fonts/Roboto-{Medium,Regular,RegularItalic,LightItalic,Bold,BoldItalic}.*'
        ],
        type: '**/*.{eot,woff,woff2,ttf,svg}'
    },
    index: {
        dest: '<%= dest %>',
        tgt: 'index.html',
        src: '<%= src %>/index.html'
    },
    images: {
        dest: '<%= dest %>/images',
        src: '<%= src %>/images/**/*.{svg,jpg,png,webp}'
    },
    data: {
        dest: '<%= dest %>/data',
        src: '<%= src %>/data/*.json'
    }
};
