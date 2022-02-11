(function () {
    "use strict"

    var passwordForm = document.querySelector("form.passwordForm")

    if (passwordForm) {
        const password = passwordForm.querySelector('input#password')
        const password2 = passwordForm.querySelector('input#password2')
        const passwordFeedback = document.querySelector('div.pw-feedback')
        passwordForm.addEventListener("submit", function (event) {
            if (password.value !== password2.value) {
                event.preventDefault()
                event.stopPropagation()
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
        },
        false
        )

        password.addEventListener('input', function(event) {
            if (password.classList.contains("is-invalid")) {
                passwordFeedback.style.display = 'none'
                password.classList.remove("is-invalid")
                password.classList.add("is-valid")
            }
        })
        password2.addEventListener('input', function(event) {
            if (password2.classList.contains("is-invalid")) {
                passwordFeedback.style.display = 'none'
                password2.classList.remove("is-invalid")
                password2.classList.add("is-valid")
            }
        })
    }

})()