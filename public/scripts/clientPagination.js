(function() {
    'use strict'

    const tableBody = document.querySelector('tbody.client-pagination')
    if (tableBody && tableBody.children.length) {
        let originalTableCells = tableBody.children
        let tableCells = tableBody.children
        let count = tableCells.length
        let currentPosition = 0
        for (let i=currentPosition; i < pageLimit; i++) {
        tableCells[i].classList.toggle('hide')
        }

        const rightArrow = document.querySelector('.client-right-arrow')
        const leftArrow = document.querySelector('.client-left-arrow')
        const leftArrowListItem = document.querySelector('.left-item')
        const rightArrowListItem = document.querySelector('.right-item')
        const pageNumShow = document.querySelector('#page-num')
        const pageTotalShow = document.querySelector("#page-total-num")
        const pageLimitSelect = document.querySelector("#pagenum-form")


        const studentSearchInput = document.querySelector('#studentSearch')
        if (studentSearchInput) {
            studentSearchInput.addEventListener('input', function(e) {
            leftArrowListItem.classList.add('disabled')
            tableCells = [...originalTableCells].filter(entry => !(entry.classList.contains('search-hidden')))
            for (let i=0; i < tableCells.length; i++) {
                if (i < pageLimit) {
                tableCells[i].classList.remove('hide')
                } else {
                tableCells[i].classList.add('hide')
                }
            }
            count = tableCells.length
            currentPosition = 0
            pageNumShow.innerHTML = 1
            pageTotalShow.innerHTML = (Math.ceil(count / pageLimit)) !== 0 ? (Math.ceil(count / pageLimit)).toString() : '1'
            if (count > pageLimit) {
                rightArrowListItem.classList.remove('disabled')
            } else {
                rightArrowListItem.classList.add('disabled')
            }
            })
        }


        pageLimitSelect.addEventListener("change", function(e) {
            pageLimit = parseInt(pageLimitSelect.value) 
            pageNumShow.innerHTML = 1
            pageTotalShow.innerHTML = (Math.ceil(count / pageLimit)) !== 0 ? (Math.ceil(count / pageLimit)).toString() : '1'
            currentPosition = 0
            leftArrowListItem.classList.add('disabled')
            if ((currentPosition + 1) + pageLimit > count) {
                rightArrowListItem.classList.add('disabled')
                for (let i=0; i < count; i++) {
                if (tableCells[i].classList.contains("hide")) {
                    tableCells[i].classList.toggle('hide')
                }
                }
            } else {
                rightArrowListItem.classList.remove('disabled')
                for (let i=0; i < pageLimit; i++) {
                if (tableCells[i].classList.contains("hide")) {
                    tableCells[i].classList.toggle('hide')
                }
                }
                for (let i=pageLimit; i < count; i++) {
                if (!(tableCells[i].classList.contains("hide"))) {
                    tableCells[i].classList.toggle('hide')
                }
                }   
            }
        })

        rightArrow.addEventListener('click', function(e) {
            e.preventDefault()
            pageNumShow.innerHTML = (parseInt(pageNumShow.innerHTML) + 1).toString()
            leftArrowListItem.classList.remove('disabled')
            for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
            }
            currentPosition += pageLimit
            if ((currentPosition + 1) + pageLimit > count) {
                rightArrowListItem.classList.add('disabled')
                for (let i=currentPosition; i < count; i++) {
                tableCells[i].classList.toggle('hide')
            }
            } else {
                for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
            }
            }
        })

        leftArrow.addEventListener('click', function(e) {
            e.preventDefault()
            pageNumShow.innerHTML = (parseInt(pageNumShow.innerHTML) - 1).toString()
            rightArrowListItem.classList.remove('disabled')
            if (currentPosition + pageLimit > count) {
                for (let i=currentPosition; i < count; i++) {
                tableCells[i].classList.add('hide')
                }
            } else {
                for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
                }
            }
            currentPosition -= pageLimit
            if (currentPosition === 0) {
                leftArrowListItem.classList.add('disabled')
            } 
            for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
            }
        })

    }
})()