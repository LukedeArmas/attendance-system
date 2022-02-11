(function () {
    "use strict"

    var dateForm = document.querySelector('#attendanceForm')
    var dateInput = document.querySelector('#date')


    function checkDate(dateString)
    {
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false

        var parts = dateString.split("/")
        var day = parseInt(parts[1], 10)
        var month = parseInt(parts[0], 10)
        var year = parseInt(parts[2], 10)

        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29

        return day > 0 && day <= monthLength[month - 1]
    };

    if (dateForm) {
        dateForm.addEventListener(
            "submit",
            function (event) {
                // Check if its a valid date and it's a date where attendance has already been marked
                if (!checkDate(dateInput.value) || invalidDates.includes(dateInput.value)) {
                    event.preventDefault()
                    event.stopPropagation()
                dateInput.classList.add("is-invalid")
                } else {
                    dateInput.classList.add("is-valid")
                    dateInput.classList.remove("is-invalid")
                }
            },
            false
        )
    }
})()