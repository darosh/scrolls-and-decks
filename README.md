[![Build Status](https://travis-ci.org/darosh/scrolls-and-decks.svg)](https://travis-ci.org/darosh/scrolls-and-decks)
[![Code Climate](https://codeclimate.com/github/darosh/scrolls-and-decks/badges/gpa.svg)](https://codeclimate.com/github/darosh/scrolls-and-decks)
[![Test Coverage](https://codeclimate.com/github/darosh/scrolls-and-decks/badges/coverage.svg)](https://codeclimate.com/github/darosh/scrolls-and-decks/coverage)
[![devDependency Status](https://david-dm.org/darosh/scrolls-and-decks/dev-status.svg)](https://david-dm.org/darosh/scrolls-and-decks#info=devDependencies)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/blob/master/LICENSE)
[![SLOC](http://img.shields.io/:sloc js-2.5k-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/tree/master/client/app)
[![SLOC](http://img.shields.io/:sloc ts-869-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/tree/master/client/types)
[![SLOC](http://img.shields.io/:sloc html-2.1k-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/tree/master/client/app)
[![SLOC](http://img.shields.io/:sloc css-1.2k-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/tree/master/client/styles)
[![SLOC](http://img.shields.io/:sloc test-465-blue.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/tree/master/tests)
[![Gitter Chat](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat)](https://gitter.im/darosh/scrolls-and-decks)

# Scrolls & Decks <sup>ALPHA</sup>

<!--[![Dev Dependency Status](https://david-dm.org/darosh/scrolls-and-decks/dev-status.svg)](https://david-dm.org/darosh/scrolls-and-decks#info=devDependencies)-->
<!--![Repo Size](https://reposs.herokuapp.com/?path=darosh/scrolls-and-decks&style=flat)-->
<!--[![GitHub Issues](http://githubbadges.herokuapp.com/darosh/scrolls-and-decks/issues.svg?style=flat)](https://github.com/darosh/scrolls-and-decks/issues)-->

Unofficial complementary tool for [scrolls.com](http://scrolls.com) gamers (and [Angular Material Design](https://material.angularjs.org/#/) experiment)

* Visit the app: [darosh.github.io/scrolls-and-decks](http://darosh.github.io/scrolls-and-decks/)
* More information: [darosh.github.io/scrolls-and-decks/#/help](http://darosh.github.io/scrolls-and-decks/#/help)

_It is [alpha](http://en.wikipedia.org/wiki/Software_release_life_cycle#Alpha) version and [Chrome](https://www.google.com/chrome/) is the only recommended browser._

## Install and build

```npm install``` tested with [node.js](https://nodejs.org/) 0.12

## Development

### Build and test toolchain

- ```gulp``` check and build, powered by [gulp.js](http://gulpjs.com/)
- ```gulp serve``` check, build, serve and watch
- ```gulp test``` check, e2e and unit, output in ```./reports```
- ```gulp e2e``` e2e test
- ```gulp unit``` unit test (alternative: ```npm run karma start```)
- ```gulp chart``` dependency charts, requires [Graphviz](http://www.graphviz.org/), output in ```./reports/chart```
- ```gulp typedoc``` [typedoc](https://github.com/sebastian-lenz/typedoc) output in ```./reports/typedoc```
- ```gulp dry``` duplication check, output in ```./reports/dry```
- ```gulp plato``` complexity visualization, output in ```./reports/plato```
- ```gulp clean```
- ```gulp deploy``` publish to [GitHub pages](https://pages.github.com/)

### Optional ```gulp``` parameters

- ```--nomin``` skip minification
- ```--norev``` skip revision hash
- ```--nobuild``` skip build
- ```--coverage``` e2e test coverage

### Additional testing

- [.idea](https://github.com/darosh/scrolls-and-decks/tree/master/.idea) project files for [WebStorm](https://www.jetbrains.com/webstorm/) JavaScript and HTML inspections, run on [client/app](https://github.com/darosh/scrolls-and-decks/tree/master/client/app) and [client/styles](https://github.com/darosh/scrolls-and-decks/tree/master/client/styles) folder
- custom [dictionaries](https://github.com/darosh/scrolls-and-decks/tree/master/dictionaries) for spell check

### Style guides

- [johnpapa/angular-styleguide](https://github.com/johnpapa/angular-styleguide) for [AngularJS](https://angularjs.org/)
- [Material design](http://www.google.com/design/spec/material-design/introduction.html) via [angular/material](https://material.angularjs.org/)

### Documentation

- [ScrollsTypes](https://cdn.rawgit.com/darosh/scrolls-and-decks/master/reports/typedoc/index.html) in TypeScript

### Roadmap

- [x] pre-alpha release
- [ ] alpha release
- [ ] beta release
  - [ ] feature freeze
  - [ ] performance issues ([Blink](http://en.wikipedia.org/wiki/Blink_%28layout_engine%29)/[WebKit](http://en.wikipedia.org/wiki/WebKit) based desktop browsers only)
  - [ ] bug fixes ([Blink](http://en.wikipedia.org/wiki/Blink_%28layout_engine%29)/[WebKit](http://en.wikipedia.org/wiki/WebKit) based browsers only, depends on [angular-material](https://material.angularjs.org/) progress)
  - [ ] color scheme
  - [ ] TODOs + comments spring cleaning
  - [ ] dependencies update
  - [ ] copywriting
- [ ] release candidate
  - [ ] Angular [1.4](https://angularjs.org/)
  - [ ] Angular Material [1.0](https://material.angularjs.org/#/) (Summer 2015?)
  - [ ] performance issues
  - [ ] accessibility
  - [ ] optimization
  - [ ] bug fixes (all browsers)
  - [ ] domain?
- [ ] nice to have
  - [x] on-field previews (and attack animations?)
  - [ ] UI localization? content (machine or community) translation? [Crowdin](https://crowdin.com/project/minecraft)?
  - [ ] black market up to date prices
  - [x] pin right sidebar scroll preview? (desktop only)
  - [ ] more charts? [d3.js](http://d3js.org/)
  - [ ] [angular-hint](https://github.com/angular/angular-hint)
  - [ ] more UI animations? (tabs?)
  - [ ] multiple filter queries (AND/OR)
  - [ ] SEO
  - [ ] Angular [2.0](https://angular.io/) (Autumn 2015?)
  - [ ] deck categorization ([brackets](http://scrolldier.com/deck/2834) notation or data flags?)

## Notes

```npm WARN deprecated gulp-uglifyjs@0.6.2: Since gulp-sourcemaps now works, use gulp-uglify instead``` -> https://github.com/terinjokes/gulp-uglify/issues/98

## License

See [The MIT License](https://github.com/darosh/scrolls-and-decks/blob/master/LICENSE)
