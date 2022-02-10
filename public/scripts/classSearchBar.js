const classSearchInput = document.querySelector('#classSearch')

if (classSearchInput) {
    const classTableCells = document.querySelector('tbody').children
    classSearchInput.addEventListener('input', () => {
    for (let tableCell of classTableCells) {
        const classCode = tableCell.querySelector('td.classCode').innerText.toLowerCase()
        const name = tableCell.querySelector('td.name').innerText.toLowerCase()
        const subject = tableCell.querySelector('td.subject').innerText.toLowerCase()
        const teacher = tableCell.querySelector('td.teacher').innerText.toLowerCase()
        const searchValue = classSearchInput.value.toLowerCase()
        const isVisible = classCode.includes(searchValue) || name.includes(searchValue) || subject.includes(searchValue) || teacher.includes(searchValue)
        tableCell.classList.toggle('hide', !isVisible)
    }
})
}
