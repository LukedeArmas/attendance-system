(function () {
  'use strict'

  var forms = document.querySelectorAll(".validated")

  // Checks if all forms have input
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        // checkValidity is a function from jquery that checks if all forms are in proper format (only applies for email)
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add("was-validated")
      },
      false
    )
  })
})()