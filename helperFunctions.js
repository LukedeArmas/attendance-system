// Sorts the studentsInClass array alphabetically based on studentId
module.exports.sortAlphabetically = function(array) {
    return array.slice().sort((a,b) => {
        if (a.student.studentId < b.student.studentId) { return -1 }
        if (a.student.studentId > b.student.studentId) { return 1 }
        return 0
    })
}