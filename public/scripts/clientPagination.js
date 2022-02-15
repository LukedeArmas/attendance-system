(function() {
    'use strict'

    // We only execute this script if a client pagination table exists and has table cells
    const tableBody = document.querySelector('tbody.client-pagination')
    if (tableBody && tableBody.children.length) {
        let originalTableCells = tableBody.children
        let tableCells = tableBody.children
        let count = tableCells.length
        let currentPosition = 0
        // We unhide the the table cells that we want to display when the page loads. We unhide the first table cells until we reach the page limit.
        // We do this because the client pagination table starts off with every table cell hidden
        // We account for if the number of table cells is less than the page limit
        let amountInitialHide = count < pageLimit ? count : pageLimit
        for (let i=currentPosition; i < amountInitialHide; i++) {
        tableCells[i].classList.toggle('hide')
        }

        const rightArrow = document.querySelector('.client-right-arrow')
        const leftArrow = document.querySelector('.client-left-arrow')
        // Selecting the left and right arrow list items allows us to toggle whether they are enabled or disabled
        const leftArrowListItem = document.querySelector('.left-item')
        const rightArrowListItem = document.querySelector('.right-item')
        // The current page in the table we are on
        const pageNumShow = document.querySelector('#page-num')
        // The total number of pages in the table
        const pageTotalShow = document.querySelector("#page-total-num")
        // The limit on the number of table cells per page
        const pageLimitSelect = document.querySelector("#pagenum-form")


        // Allows the student search functionality to properly work with the client side pagination
        const studentSearchInput = document.querySelector('#studentSearch')
        if (studentSearchInput) {
            studentSearchInput.addEventListener('input', function(e) {
            // We disable the left arrow button because when a user inputs into the search bar we are automatically going back to page 1
            leftArrowListItem.classList.add('disabled')
            // Our array of table cells (that we are allowed to work with) now becomes only the table cells that were not hidden by the search
            tableCells = [...originalTableCells].filter(entry => !(entry.classList.contains('search-hidden')))
            // The new table cell count (only including the cells not hidden by the search)
            count = tableCells.length
            // Since we are on page 1 again we only show the table cells up until the page limit and then hide the others
            for (let i=0; i < count; i++) {
                if (i < pageLimit) {
                    tableCells[i].classList.remove('hide')
                } else {
                    tableCells[i].classList.add('hide')
                }
            }
            // We go back to position 0 of the table cell array because we are going back to page 1
            currentPosition = 0
            // We set the current page and total number of pages properly
            pageNumShow.innerHTML = 1
            // We have to account for no matches in the search and set the total pages to 1 (it would be zero instead) in this case
            pageTotalShow.innerHTML = (Math.ceil(count / pageLimit)) !== 0 ? (Math.ceil(count / pageLimit)).toString() : '1'
            // If we have more table cells than the page limit we enable the right arrow button, otherwise we disable it 
            if (count > pageLimit) {
                rightArrowListItem.classList.remove('disabled')
            } else {
                rightArrowListItem.classList.add('disabled')
            }
            })
        }

        // Allows the class search functionality to properly work with the client side pagination
        const classSearchInput = document.querySelector('#classSearch')
        if (classSearchInput) {
            classSearchInput.addEventListener('input', function(e) {
            // We disable the left arrow button because when a user inputs into the search bar we are automatically going back to page 1
            leftArrowListItem.classList.add('disabled')
            // Our array of table cells (that we are allowed to work with) now becomes only the table cells that were not hidden by the search
            tableCells = [...originalTableCells].filter(entry => !(entry.classList.contains('search-hidden')))
            // The new table cell count (only including the cells not hidden by the search)
            count = tableCells.length
            // Since we are on page 1 again we only show the table cells up until the page limit and then hide the others
            for (let i=0; i < count; i++) {
                if (i < pageLimit) {
                    tableCells[i].classList.remove('hide')
                } else {
                    tableCells[i].classList.add('hide')
                }
            }
            // We go back to position 0 of the table cell array because we are going back to page 1
            currentPosition = 0
            // We set the current page and total number of pages properly
            pageNumShow.innerHTML = 1
            // We have to account for no matches in the search and set the total pages to 1 (it would be zero instead) in this case
            pageTotalShow.innerHTML = (Math.ceil(count / pageLimit)) !== 0 ? (Math.ceil(count / pageLimit)).toString() : '1'
            // If we have more table cells than the page limit we enable the right arrow button, otherwise we disable it 
            if (count > pageLimit) {
                rightArrowListItem.classList.remove('disabled')
            } else {
                rightArrowListItem.classList.add('disabled')
            }
            })
        }

        // Allows the user to change the page limit of the number of table cells
        pageLimitSelect.addEventListener("change", function(e) {
            // We change the page limit to be what the user selected
            pageLimit = parseInt(pageLimitSelect.value) 
            // We set the current page and total number of pages properly
            pageNumShow.innerHTML = 1
            // We have to account for no matches in the search and set the total pages to 1 (it would be zero instead) in this case
            // If we do not account for this the total pages number will appear as zero if the user puts in a search input with no matches and then proceeds to change the page limit
            pageTotalShow.innerHTML = (Math.ceil(count / pageLimit)) !== 0 ? (Math.ceil(count / pageLimit)).toString() : '1'
            // We go back to position 0 of the table cell array because we are going back to page 1
            currentPosition = 0
            // We disable the left arrow button because when a user changes the page limit we are automatically going back to page 1
            leftArrowListItem.classList.add('disabled')
            // If the number of table cells is less than the page limit then we disable the right arrow and unhide all table cells
            if ((currentPosition + 1) + pageLimit > count) {
                rightArrowListItem.classList.add('disabled')
                for (let i=0; i < count; i++) {
                    if (tableCells[i].classList.contains("hide")) {
                        tableCells[i].classList.toggle('hide')
                    }
                }
            } 
            // Otherwise we enable the right arrow, unhide the first table cells up until the page limit, and hide all the other table cells
            else {
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

        // Shows the next page of table cells
        rightArrow.addEventListener('click', function(e) {
            e.preventDefault()
            // Add 1 to the current page and enable the left arrow button
            pageNumShow.innerHTML = (parseInt(pageNumShow.innerHTML) + 1).toString()
            leftArrowListItem.classList.remove('disabled')
            // We hide all the table cells from the current page
            for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
            }
            // We change our position in the table cells array to match the start of the next page
            // Now the next page is the current page
            currentPosition += pageLimit
            // We unhide the table cells from the current page
            // Un-hides the proper amount of table cells if we have reached the end of the table cells array
            if ((currentPosition + 1) + pageLimit > count) {
                rightArrowListItem.classList.add('disabled')
                for (let i=currentPosition; i < count; i++) {
                    tableCells[i].classList.toggle('hide')
                }
            } 
            // Otherwise we just unhide the the page limit amount of table cells for the current page 
            else {
                for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                    tableCells[i].classList.toggle('hide')
                }
            }
        })

        // Shows the previous page of table cells
        leftArrow.addEventListener('click', function(e) {
            e.preventDefault()
            // Subtract 1 to the current page and enable the right arrow button
            pageNumShow.innerHTML = (parseInt(pageNumShow.innerHTML) - 1).toString()
            rightArrowListItem.classList.remove('disabled')
            // We hide all table cells from the current page 
            // This condition accounts for hiding the table cells on the current page if we reached the end of the table cells array
            if (currentPosition + pageLimit > count) {
                for (let i=currentPosition; i < count; i++) {
                tableCells[i].classList.add('hide')
                }
            }
            // Otherwise we hide the pageLimit number of table cells from the current page
            else {
                for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
                }
            }
            // We change our position in the table cells array to match the start of the previous page
            // Now the previous page is the current page
            currentPosition -= pageLimit
            // We disable the left arrow button if we've reached the beginning of the table cells array (page 1)
            if (currentPosition === 0) {
                leftArrowListItem.classList.add('disabled')
            }
            // We unhide the table cells for the current page 
            for (let i=currentPosition; i < currentPosition + pageLimit; i++) {
                tableCells[i].classList.toggle('hide')
            }
        })
    }
})()