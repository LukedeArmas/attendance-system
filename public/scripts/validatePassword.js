(function () {
    'use strict'

    var passwordForm = document.querySelector("form.passwordForm")

    // We only use this script if a password form exists
    if (passwordForm) {

        // DOM Initializations

        const password = passwordForm.querySelector('input#password')
        const password2 = passwordForm.querySelector('input#password2')
        // We are only displaying feedback under "Confirm Password" so there is only one feedback div
        const passwordFeedback = document.querySelector('div.pw-feedback')

        // Callback Functions

        function passwordFormCallback(e) {
            // Stops form from submitting and shows error message if passwords are not equal
            if (password.value !== password2.value) {
                e.preventDefault()
                e.stopPropagation()
                passwordForm.classList.remove("was-validated")
                password.classList.add("is-invalid")
                password2.classList.add("is-invalid")
                passwordFeedback.style.display = 'block'
            } else {
                password.classList.remove("is-invalid")
                password2.classList.remove("is-invalid")
                password.classList.add("is-valid")
                password2.classList.add("is-valid")
            }
        }

        function passwordCallback(e) {
            if (e.target.classList.contains("is-invalid")) {
                passwordFeedback.style.display = 'none'
                e.target.classList.remove("is-invalid")
                e.target.classList.add("is-valid")
            }
        }

        // Event Listeners

        // Checks if passwords are equal to each other (Password and Confirm Password)
        passwordForm.addEventListener("submit", passwordFormCallback, false)

        // Removes invalid display and feedback when user begins typing again for first password
        password.addEventListener('input', passwordCallback)

        // Removes invalid display and feedback when user begins typing again for second password
        password2.addEventListener('input', passwordCallback)
    }

})()