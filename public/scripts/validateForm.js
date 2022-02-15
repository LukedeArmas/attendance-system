(function () {
  'use strict'

  // DOM Initializations

  var forms = document.querySelectorAll(".validated")

  // Callback Functions

  function formCallback(e) {
    // checkValidity is a function from jquery that checks if all forms are in proper format (only applies for email)
        if (!e.target.checkValidity()) {
          e.preventDefault()
          e.stopPropagation()
        }
        e.target.classList.add("was-validated")
  }

  // Event Listeners

  // Checks if all forms have input
  [...forms].forEach((form) => { 
    form.addEventListener("submit", formCallback, false)
  })

})()