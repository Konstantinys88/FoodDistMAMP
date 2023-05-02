function modal() {
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
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
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

}

module.exports = modal;