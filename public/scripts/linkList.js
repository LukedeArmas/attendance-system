var classId = /^\/class\/[0-9a-fA-F]{24}$/
var studentId = /^\/student\/[0-9a-fA-F]{24}$/
var attendanceDashboard = /^\/class\/[0-9a-fA-F]{24}\/attendance$/
var attendance = /^\/class\/[0-9a-fA-F]{24}\/attendance\/[0-9a-fA-F]{24}$/

if (location.pathname === '/class' || location.pathname === '/student' || classId.test(location.pathname) || studentId.test(location.pathname) || attendanceDashboard.test(location.pathname) || attendance.test(location.pathname) ) {
    const pathArray = location.pathname.split('/').slice(1)
    const linkList = document.querySelector('.link-list')

    var urlSoFar = ''
    let a = document.createElement('a')
    linkList.appendChild(a)
    a.textContent = 'Monitor'
    a.classList.add('sidebar-heading')
    a.setAttribute('href', '/')

    for (let subUrl of pathArray) {
        urlSoFar = urlSoFar + '/' + subUrl
        console.log(urlSoFar)
        let a = document.createElement('a')
        linkList.innerHTML += ' / '
        linkList.appendChild(a)
        a.classList.add('sidebar-heading')
        a.setAttribute('href', urlSoFar)

        if (urlSoFar === '/class') {
            a.innerHTML = 'Class Dashboard'
         } else if (urlSoFar === '/student') {
            a.innerHTML = 'Student Dashboard'
         } else if (classId.test(urlSoFar)) {
            a.innerHTML = 'Class'
         } else if (studentId.test(urlSoFar)) {
             a.innerHTML = 'Student'
         } else if (attendanceDashboard.test(urlSoFar)) {
             a.innerHTML = 'Attendance Dashboard'
         } else if (attendance.test(urlSoFar)) {
             a.innerHTML = 'Attendance'
         }
        }

    $(function(){
        $('.link-list a').each(function(){
            var $this = $(this);
            if($this.attr('href') === location.pathname){
                $this.addClass('link-active');
            }
        })
    })
}
