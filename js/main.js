"use strict";

document.addEventListener('DOMContentLoaded', () => {
// Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = "none";
        });
        tabs.forEach(tab => {
            tab.classList.remove("tabheader__item_active");
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })

// Timer

const deadline = "2024-04-22";

function getTimeRemaiming(endtime) {
    let days, hours, minutes, seconds;

    const t = Date.parse(endtime) - Date.parse(new Date());

    if(t <= 0) {
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0; 
    } else {
        days = Math.floor(t / (1000 * 60 * 60 * 24));
        hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        minutes =  Math.floor((t / 1000 / 60) % 60);
        seconds = Math.floor((t / 1000) % 60);
    }

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds,
    };
}

function getZero(num) {
    if(num >= 0 && num < 0) {
        return `0${num}`;
    } else {
        return num
    }
}

function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');
    const timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
        const t = getTimeRemaiming(endtime);

        days.innerHTML = getZero(t.days);
        hours.innerHTML = getZero(t.hours);
        minutes.innerHTML = getZero(t.minutes);
        seconds.innerHTML = getZero(t.seconds);

        console.log(t.days);

        if(t.total <= 0) {
            clearInterval(timeInterval);
        }
    }
}

setClock(".timer", deadline);

// modal

const modaltrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');
    // modalCloseBtn = document.querySelector('.modal__close');

    modaltrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    })

    function openModal() {
        // modal.style.display = "block";
        modal.classList.add('show');
        modal.classList.remove('hiden');
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.add('hiden');
        modal.classList.remove('show');
        // modal.style.display = "none";
        document.body.style.overflow = "";
        clearInterval(modalTimerId);
    }

    // modalCloseBtn.addEventListener('click', closeModal)

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) { 
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parentSelector = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27
            this.changToUAH();
        }
        changToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span>$/день</div>
                </div>
            `;
            this.parentSelector.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
           throw new Error(`Could not feth ${url} status ${res.status}`);
        }

        return await res.json();
    }  

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });

    axios.get('http://localhost:3000/menu')
    .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

    //Forms

    const forms = document.querySelectorAll('form');

    const messege = { 
        loading: 'icons/spinner.svg',
        success: 'Спасибо скоро мы с вами свяжемся!',
        failure: 'Errorr...'
    }

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type':'application/json'
            },  
            body: data
        });
        return await res.json();
    }    

    function bindPostData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = messege.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThinksMOdal(messege.success);
                form.reset();
                statusMessage.remove();
            }).catch(() => {
                showThinksMOdal(messege.failure);
            }).finally(() => {
                form.reset();
            })
        });
    }

    function showThinksMOdal(messege) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hiden');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${messege}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hiden');
            closeModal();
        }, 4000)
    }

    //Slider

    const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let ofset = 0;

    // сложный слайдер ----------------------------------------------------------------

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = `${slides.length}`;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + "%";
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width
    });

    next.addEventListener('click', () => {
        if(ofset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            ofset = 0;
        } else {
            ofset += +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${ofset}px)`;

        if(slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        if(ofset == 0) {
            ofset = +width.slice(0, width.length - 2) * (slides.length - 1)
        } else {
            ofset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${ofset}px)`;

        if(slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });



    // простой слайдер-----------------------------------------------------------------

    // showSlidex(slideIndex);

    // if(slides.length < 10) {
    //     total.textContent = `0${slides.length}`
    // } else {
    //     total.textContent = `${slides.length}`
    // }

    // function showSlidex(n) {
    //     if(n > slides.length) {
    //         slideIndex = 1;
    //     } 
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //     slides.forEach((item) => item.style.display = 'none');
    //     slides[slideIndex - 1].style.display = 'block';

    //     if(slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n) {
    //     showSlidex(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // })



});


