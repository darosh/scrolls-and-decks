'use strict';

describe('art directive', function() {
    var $compile,
        $rootScope;

    beforeEach(module('app.directives'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should set background-position', function() {
        var element = $compile('<div app-art="1px 1px"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.css('background-position')).toBe('1px 1px');
    });
});
