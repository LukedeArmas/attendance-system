(function() {
    'use strict'

    const passwordContainers = document.querySelectorAll('div.pw-div')

    // Script only runs if password containers exist
    if (passwordContainers) {
        // Applies the "show password" functionality to all passwords
        [...passwordContainers].forEach(passwordDiv => {
            const passwordInput = passwordDiv.querySelector('input')
            const icon = passwordDiv.querySelector('span.icon')
            icon.addEventListener('click', () => {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
            })
        })
    }
})()


