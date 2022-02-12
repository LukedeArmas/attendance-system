const studentSearchInput = document.querySelector('#studentSearch')
const studentTableBody = document.querySelector('tbody')

if (studentSearchInput && studentTableBody) {
    const studentTableCells = studentTableBody.children
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
