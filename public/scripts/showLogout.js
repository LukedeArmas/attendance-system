(function() {
    'use strict'
    
    const sideLogoutDiv = document.querySelector('.side-logout-div')
    const topLogoutLink = document.querySelector('.top-logout-link')
    // We only use this script if logout div exists
    if (sideLogoutDiv && topLogoutLink) {
        // DOM Initializations
        if (window.innerWidth < 768) {
          sideLogoutDiv.classList.remove('hide')
        } else {
          topLogoutLink.classList.remove('hide')
        }

        // Callback Functions
        const adjustLogout = () => {
          const sideNavVisible = window.innerWidth < 768
          topLogoutLink.classList.toggle('hide', sideNavVisible)
          sideLogoutDiv.classList.toggle('hide', !sideNavVisible)
        }
        // Event Listeners
        // Shows logout on sidebar menu when below 768px and hides on top nav bar menu
        // When above 768px it shows on top nav bar menu and hides on side bar
        window.addEventListener('resize', adjustLogout)
    }
})()
