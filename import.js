'use strict';

window.SADimport = function () {
    var j;

    if (window.location.hostname === 'scrolldier.com') {
        j = JSON.parse(window.$('input.exportBox').val());
    } else if (window.location.hostname === 'www.scrollsguide.com') {
        j = {deck: window.openedDeckName, types: []};
        window.board.find('.scroll').each(function () {
            j.types.push(parseInt(window.getIdFromClass(window.$(this))));
        });
    }

    if (j) {
        j.version = window.SADversion;
        j.origin = window.location.href;
        var a = [];
        for(var k in j) {
            if(j.hasOwnProperty(k)) {
                a.push(k + '=' + encodeURIComponent(j[k]));
            }
        }
        window.location.href = window.SADhome + '?' + a.join('&');
    }
};

window.SADimport();
