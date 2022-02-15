(function() {
    'use strict'

    const classSearchInput = document.querySelector('#classSearch')

    // We only use this script if a class search bar exists
    if (classSearchInput) {
        const classTableCells = document.querySelector('tbody').children
        classSearchInput.addEventListener('input', () => {
            for (let tableCell of classTableCells) {
                const classCode = tableCell.querySelector('td.classCode').innerText.toLowerCase()
                const name = tableCell.querySelector('td.name').innerText.toLowerCase()
                const subject = tableCell.querySelector('td.subject').innerText.toLowerCase()
                const teacher = tableCell.querySelector('td.teacher').innerText.toLowerCase()
                const searchValue = classSearchInput.value.toLowerCase()
                // Check if the search input is included in either class code, name, subject, or teacher
                const isVisible = classCode.includes(searchValue) || name.includes(searchValue) || subject.includes(searchValue) || teacher.includes(searchValue)
                // We hide the class if they don't meet the search criteria, if they do we unhide them
                tableCell.classList.toggle('hide', !isVisible)
                // This indicates which classes were hidden by this search script, which is later used in conjunction with the client pagination script
                tableCell.classList.toggle('search-hidden', !isVisible)
            }
        })
    }
})()


