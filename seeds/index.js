const Student = require('../models/student.js')
const Class = require('../models/class.js')


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/attendance')
.catch(e => console.log('Error', e))

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})

    // studentId: 'dearmalp',
    // firstName: 'Luke',
    // lastName: 'de Armas',
    // classesEnrolled: []

const newStudent = {
    studentId: 'smithknlm',
    firstName: 'Kenny',
    lastName: 'Smith',
    // classesEnrolled: []
}

async function addStudent(newStudent) {
    // await Student.deleteMany({})
    const student = new Student(newStudent)
    await student.save()
    .catch(e => console.log('Failed to insert student', escape))
}

// addStudent(newStudent).then(() => {
//     mongoose.connection.close()
// })


const newClass = {
    teacher: 'Mr. Miller',
    className: 'Programming and Problem Solving',
    classCode: 'CS-1101',
    section: 1,
    subject: 'Computer Science'
    // studentsInClass: [],
    // attendance: [
    //     {
    //         date: '2002-12-09',
    //         studentsPresent: []
    //     }
    // ]
}

async function addClass(newClass) {
    // await Class.deleteMany({})
    const createdClass = new Class(newClass)
    await createdClass.save()
    .catch(e => console.log('Failed to insert class', escape))
}

async function addClassStudent(newClass, newStudent) {
    try {
        const student = await new Student(newStudent)
        const createdClass = await new Class(newClass)
        student.classesEnrolled.push(createdClass)
        createdClass.studentsInClass.push(student)
        // createdClass.attendance[0].studentsPresent.push(student)
        await student.save()
        await createdClass.save()
    }
    catch(e) {
        console.log(e)
    }

}

addClassStudent(newClass, newStudent).then(() => {
    mongoose.connection.close()
})


// addClass(newClass).then(() => {
//     mongoose.connection.close()
// })