"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs'),
        modal = require('./modules/modal'),
        timer = require('./modules/timer'),
        slider = require('./modules/slider'),
        calc = require('./modules/calc'),
        forms = require('./modules/forms'),
        cards = require('./modules/cards');

    tabs();
    modal();
    timer();
    slider();
    calc();
    forms();
    cards();

});


// npx json-server db.json - для запуска бд

