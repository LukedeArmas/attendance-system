(function() {
    'use strict'

    // Regex expressions to check if the current URL is in any of these forms
    var classId = /^\/class\/[0-9a-fA-F]{24}$/
    var studentId = /^\/student\/[0-9a-fA-F]{24}$/
    var teacherId = /^\/teacher\/[0-9a-fA-F]{24}$/
    var attendanceDashboard = /^\/class\/[0-9a-fA-F]{24}\/attendance$/
    var attendance = /^\/class\/[0-9a-fA-F]{24}\/attendance\/[0-9a-fA-F]{24}$/

    // We only add the link list if the url matches any of these
    if (location.pathname === '/class' || location.pathname === '/student' || location.pathname === '/teacher' || classId.test(location.pathname) || (typeof currentUser !== 'undefined' && currentUser.username === 'admin' && studentId.test(location.pathname)) || teacherId.test(location.pathname) || attendanceDashboard.test(location.pathname) || attendance.test(location.pathname) ) {
        const pathArray = location.pathname.split('/').slice(1)
        const linkList = document.querySelector('.link-list')

        // We add the monitor link to the list every time
        var urlSoFar = ''
        let a = document.createElement('a')
        linkList.appendChild(a)
        a.textContent = 'Monitor'
        a.classList.add('sidebar-heading')
        a.setAttribute('href', '/')

        // We go through the pieces of the url and add the associated link to the list if the url piece matches any of the indicated sub urls
        for (let subUrl of pathArray) {
            urlSoFar = urlSoFar + '/' + subUrl
            let a = document.createElement('a')
            linkList.innerHTML += ' / '
            linkList.appendChild(a)
            a.classList.add('sidebar-heading')
            a.setAttribute('href', urlSoFar)

            if (urlSoFar === '/class') {
                a.innerHTML = 'Class Dashboard'
            } else if (urlSoFar === '/student') {
                a.innerHTML = 'Student Dashboard'
            } else if (urlSoFar === '/teacher') {
                a.innerHTML = 'Teacher Dashboard'
            } else if (classId.test(urlSoFar)) {
                a.innerHTML = 'Class'
            } else if (studentId.test(urlSoFar)) {
                a.innerHTML = 'Student'
            } else if (teacherId.test(urlSoFar)) {
                a.innerHTML = 'Teacher'
            } else if (attendanceDashboard.test(urlSoFar)) {
                a.innerHTML = 'Attendance Dashboard'
            } else if (attendance.test(urlSoFar)) {
                a.innerHTML = 'Attendance'
            }
        }

        // We make the link of the current url active (blue colored)
        const links = document.querySelectorAll('.link-list a')
        if (links) {
            links.forEach((link) => {
                if (link.getAttribute('href') === location.pathname) {
                    link.classList.add('link-active')
                }
            })
        }
    }
})()


