const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, objectIdMiddleware, isLoggedIn, verifyTeacher, isAdmin } = require('../middleware.js')
const myClass = require('../controllers/class')


router.route('/')
    .get(isLoggedIn, asyncError(myClass.home))
    .post(isLoggedIn, isAdmin, validateClass, asyncError(myClass.post))

router.route('/new')
    .get(isLoggedIn, isAdmin, asyncError(myClass.new))

router.route('/:id')
    .get(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(myClass.show))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateClass, asyncError(myClass.put))
    .delete(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(myClass.delete))
    
router.route('/:id/edit')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(myClass.edit))

router.route('/:id/addStudent')
    .get(isLoggedIn, isAdmin, myClass.reloadPage, objectIdMiddleware, asyncError(myClass.addStudentGet))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateAddStudentToClass, asyncError(myClass.addStudentPut))

router.route('/:id/removeStudent')
    .get(isLoggedIn, isAdmin, myClass.reloadPage, objectIdMiddleware, asyncError(myClass.removeStudentGet))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateRemoveStudentFromClass, asyncError(myClass.removeStudentPut))


module.exports = router