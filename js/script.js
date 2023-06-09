"use strict";
require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from  './modules/timer';
import slider from './modules/slider';
import calc from './modules/calc';
import forms from './modules/forms';
import cards from './modules/cards';
import {openModal} from './modules/modal';

document.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000);

    tabs(".tabheader__item",".tabcontent",".tabheader__items","tabheader__item_active");
    modal('[data-modal]', '.modal', modalTimerId);
    timer(".timer", "2024-04-22");
    slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prewArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner',
        slide: '.offer__slide',
    });
    calc();
    forms('form', modalTimerId);
    cards();

});


// npx json-server db.json - для запуска бд

