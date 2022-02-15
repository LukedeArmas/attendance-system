(function() {
    'use strict'

    // We get the left and right button so we can add click listeners to them
    const rightArrow = document.querySelector('.right-arrow')
    const leftArrow = document.querySelector('.left-arrow')

    // We have a submit on click event listener already included in the html if the user either clicks the left arrow, right arrow, or changes the limit per page

    if (leftArrow && rightArrow) {
        rightArrow.addEventListener('click', function() {
            // We add 1 to the page number (included in the page number data on the arrow) and attach it is as a query string which will automatically be submitted
            if ('URLSearchParams' in window) {
                var searchParams = new URLSearchParams(window.location.search)
                searchParams.set("page", rightArrow.dataset.pageNumber)
                window.location.search = searchParams.toString()
            }
        })
        leftArrow.addEventListener('click', function() {
            // We subtract 1 to the page number (included in the page number data on the arrow) and attach it is as a query string which will automatically be submitted
            if ('URLSearchParams' in window) {
                var searchParams = new URLSearchParams(window.location.search)
                searchParams.set("page", leftArrow.dataset.pageNumber)
                window.location.search = searchParams.toString()
            }
        })
    }
})()