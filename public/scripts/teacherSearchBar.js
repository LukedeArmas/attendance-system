(function() {
    'use strict'

    const teacherSearchInput = document.querySelector('#teacherSearch')

    // We only use this script if a teacher search bar exists
    if (teacherSearchInput) {
        const teacherTableCells = document.querySelector('tbody').children
        teacherSearchInput.addEventListener('input', () => {
            for (let tableCell of teacherTableCells) {
                const firstName = tableCell.querySelector('td.firstName').innerText.toLowerCase()
                const lastName = tableCell.querySelector('td.lastName').innerText.toLowerCase()
                const userName = tableCell.querySelector('td.userName').innerText.toLowerCase()
                const email = tableCell.querySelector('td.email').innerText.toLowerCase()
                const searchValue = teacherSearchInput.value.toLowerCase()
                // Check if the search input is included in either first name, last name, user name, or email
                const isVisible = firstName.includes(searchValue) || lastName.includes(searchValue) || userName.includes(searchValue) || email.includes(searchValue)
                // We hide the teacher if they don't meet the search criteria, if they do we unhide them
                tableCell.classList.toggle('hide', !isVisible)
            }
        })
    }
})()


