const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, objectIdMiddleware, isLoggedIn, verifyTeacher, isAdmin, teacherExists } = require('../middleware.js')
const myClass = require('../controllers/class')


router.route('/')
    .get(isLoggedIn, asyncError(myClass.home))
    .post(isLoggedIn, isAdmin, asyncError(teacherExists), validateClass, asyncError(myClass.post))

router.route('/new')
    .get(isLoggedIn, isAdmin, asyncError(teacherExists), asyncError(myClass.new))

router.route('/:id')
    .get(isLoggedIn, objectIdMiddleware, asyncError(verifyTeacher), asyncError(myClass.show))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateClass, asyncError(myClass.put))
    .delete(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(myClass.delete))
    
router.route('/:id/edit')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(myClass.edit))

router.route('/:id/addStudent')
    .get(isLoggedIn, isAdmin, myClass.reloadPage, objectIdMiddleware, asyncError(myClass.addStudentGet))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(validateAddStudentToClass), asyncError(myClass.addStudentPut))

router.route('/:id/removeStudent')
    .get(isLoggedIn, isAdmin, myClass.reloadPage, objectIdMiddleware, asyncError(myClass.removeStudentGet))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(validateRemoveStudentFromClass), asyncError(myClass.removeStudentPut))


module.exports = router