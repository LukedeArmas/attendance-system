const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const {validateStudent, objectIdMiddleware, isLoggedIn, isAdmin } = require('../middleware.js')
const student = require('../controllers/student')

router.route('/')
    .get(isLoggedIn, isAdmin, asyncError(student.home))
    .post(isLoggedIn, isAdmin, validateStudent, asyncError(student.post))

router.route('/new')
    .get(isLoggedIn, isAdmin, student.new)

router.route('/:id')
    .get(isLoggedIn, objectIdMiddleware, asyncError(student.show))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateStudent, asyncError(student.put))
    .delete(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(student.delete))
    
router.route('/:id/edit')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(student.edit))

module.exports = router