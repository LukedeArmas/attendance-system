const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const {validateClass, validateAddStudentToClass, validateRemoveStudentFromClass, objectIdMiddleware } = require('../middleware.js')
const myClass = require('../controllers/class')


router.route('/')
    .get(asyncError(myClass.home))
    .post(validateClass, asyncError(myClass.post))

router.route('/new')
    .get(myClass.new)

router.route('/:id')
    .get(objectIdMiddleware, asyncError(myClass.show))
    .put(objectIdMiddleware, validateClass, asyncError(myClass.put))
    .delete(objectIdMiddleware, asyncError(myClass.delete))
    
router.route('/:id/edit')
    .get(objectIdMiddleware, asyncError(myClass.edit))

router.route('/:id/addStudent')
    .get(myClass.reloadPage, objectIdMiddleware, asyncError(myClass.addStudentGet))
    .put(objectIdMiddleware, validateAddStudentToClass, asyncError(myClass.addStudentPut))

router.route('/:id/removeStudent')
    .get(myClass.reloadPage, objectIdMiddleware, asyncError(myClass.removeStudentGet))
    .put(objectIdMiddleware, validateRemoveStudentFromClass, asyncError(myClass.removeStudentPut))


module.exports = router