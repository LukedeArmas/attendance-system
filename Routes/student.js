const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const {validateStudent, objectIdMiddleware} = require('../middleware.js')
const student = require('../controllers/student')

router.route('/')
    .get(asyncError(student.home))
    .post(validateStudent, asyncError(student.post))

router.route('/new')
    .get(student.new)

router.route('/:id')
    .get(objectIdMiddleware, asyncError(student.show))
    .put(objectIdMiddleware, validateStudent, asyncError(student.put))
    .delete(objectIdMiddleware, asyncError(student.delete))
    
router.route('/:id/edit')
    .get(objectIdMiddleware, asyncError(student.edit))

module.exports = router