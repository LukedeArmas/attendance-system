const studentSearchInput = document.querySelector('#studentSearch')


if (studentSearchInput) {
    const studentTableCells = document.querySelector('tbody').children
    studentSearchInput.addEventListener('input', () => {
    for (let tableCell of studentTableCells) {
        const id = tableCell.querySelector('td.id').innerText.toLowerCase()
        const firstName = tableCell.querySelector('td.firstName').innerText.toLowerCase()
        const lastName = tableCell.querySelector('td.lastName').innerText.toLowerCase()
        const searchValue = studentSearchInput.value.toLowerCase()
        const isVisible = id.includes(searchValue) || firstName.includes(searchValue) || lastName.includes(searchValue)
        tableCell.classList.toggle('hide', !isVisible)
    }
})
}
