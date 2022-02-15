(function() {
    'use strict'

    const studentSearchInput = document.querySelector('#studentSearch')

    // We only use this script if a student search bar exists
    if (studentSearchInput) {

        // DOM Initializations

        const studentTableCells = document.querySelector('tbody').children

        // Callback Functions

        function studentSearchCallback() {
            for (let tableCell of studentTableCells) {
                const id = tableCell.querySelector('td.id').innerText.toLowerCase()
                const firstName = tableCell.querySelector('td.firstName').innerText.toLowerCase()
                const lastName = tableCell.querySelector('td.lastName').innerText.toLowerCase()
                const searchValue = studentSearchInput.value.toLowerCase()
                // Check if the search input is included in either first name, last name, or student id
                const isVisible = id.includes(searchValue) || firstName.includes(searchValue) || lastName.includes(searchValue)
                // We hide the student if they don't meet the search criteria, if they do we unhide them
                tableCell.classList.toggle('hide', !isVisible)
                // This indicates which students were hidden by this search script, which is later used in conjunction with the client pagination script
                tableCell.classList.toggle('search-hidden', !isVisible)
            }
        }

        // Event Listeners

        // Shows and hides students whenever search inputs
        studentSearchInput.addEventListener('input', studentSearchCallback)
    }
})()


