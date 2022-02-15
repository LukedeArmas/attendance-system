(function() {
    'use strict'

    // We make the sidebar link blue colored if it is the current url
    const sideBarLinks = document.querySelectorAll('#sidebarMenu li a')
    if (sideBarLinks) {
        sideBarLinks.forEach((link) => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active')
            }
        })
    }
})()

