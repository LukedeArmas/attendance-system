const teacherSearchInput = document.querySelector('#teacherSearch')

if (teacherSearchInput) {
    const teacherTableCells = document.querySelector('tbody').children
    teacherSearchInput.addEventListener('input', () => {
    for (let tableCell of teacherTableCells) {
        const firstName = tableCell.querySelector('td.firstName').innerText.toLowerCase()
        const lastName = tableCell.querySelector('td.lastName').innerText.toLowerCase()
        const userName = tableCell.querySelector('td.userName').innerText.toLowerCase()
        const email = tableCell.querySelector('td.email').innerText.toLowerCase()
        const searchValue = teacherSearchInput.value.toLowerCase()
        const isVisible = firstName.includes(searchValue) || lastName.includes(searchValue) || userName.includes(searchValue) || email.includes(searchValue)
        tableCell.classList.toggle('hide', !isVisible)
    }
})
}