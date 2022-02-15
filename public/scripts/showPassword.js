(function() {
    'use strict'

    const passwordDivs = document.querySelectorAll('div.pw-div')

    if (passwordDivs) {
        passwordDivs.forEach(passwordDiv => {
            const passwordInput = passwordDiv.querySelector('input')
            const icon = passwordDiv.querySelector('span.icon')
            icon.addEventListener('click', (event) => {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
            })
        })
    }
})()


