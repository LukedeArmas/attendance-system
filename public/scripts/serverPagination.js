(function() {
    'use strict'

    // DOM Initializations

    // These are the left and right arrow buttons
    const leftArrow = document.querySelector('.left-arrow')
    const rightArrow = document.querySelector('.right-arrow')
    const pageLimitSelect = document.querySelector('#pagenum-form')

    // IMPORTANT!!!
    // We have a submit on change event listener already included in the html if the user changes the limit per page

    // The left and right arrow buttons must be present for this to run 
    if (leftArrow && rightArrow && pageLimitSelect) {

        // Callback Functions

        // We either add or subtract 1 to the page number (included in the page number data on the arrow) and attach it is as a query string which will automatically be submitted
        function arrowCallback(e) {
            if ('URLSearchParams' in window) {
                var searchParams = new URLSearchParams(window.location.search)
                searchParams.set("page", e.currentTarget.dataset.pageNumber)
                window.location.search = searchParams.toString()
            }
        }


        // Event Listeners

        // Goes to next page of table cells when we click right arrow
        rightArrow.addEventListener('click', arrowCallback)

        // Goes to previous page of table cells when we click left arrow
        leftArrow.addEventListener('click', arrowCallback)

        // Changes the amount of table cells shown to match limit per page
        pageLimitSelect.addEventListener('change', function(e) {
            e.target.form.submit()
        })
    }
})()