const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const { objectIdMiddleware, isLoggedIn, isAdmin } = require('../middleware.js')
const teacher = require('../controllers/teacher')


router.route('/')
    .get(isLoggedIn, isAdmin, asyncError(teacher.home))
    .post(isLoggedIn, isAdmin, asyncError(teacher.post))

router.route('/new')
    .get(isLoggedIn, isAdmin, teacher.new)

router.route('/:id')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.show))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.put))
    .delete(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.delete))

router.route('/:id/edit')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.edit))


module.exports = router