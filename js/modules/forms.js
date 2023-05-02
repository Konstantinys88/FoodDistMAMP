function forms() {
    //Forms Урок 90

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
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    }

    function bindPostData(form) {
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

}

module.exports = forms;