const express = require('express')
const router = express.Router()
const asyncError = require('../utils/asyncError.js')
const { objectIdMiddleware, isLoggedIn, isAdmin, validateNewTeacher, validateEditTeacher, validateUpdatePassword, pagination } = require('../middleware.js')
const teacher = require('../controllers/teacher')


router.route('/')
    .get(isLoggedIn, isAdmin, pagination, asyncError(teacher.home))
    .post(isLoggedIn, isAdmin, validateNewTeacher, asyncError(teacher.post))

router.route('/new')
    .get(isLoggedIn, isAdmin, teacher.new)

router.route('/:id')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.show))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateEditTeacher, asyncError(teacher.put))
    .delete(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.delete))

router.route('/:id/edit')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.edit))

router.route('/:id/updatePassword')
    .get(isLoggedIn, isAdmin, objectIdMiddleware, asyncError(teacher.getUpdatePassword))
    .put(isLoggedIn, isAdmin, objectIdMiddleware, validateUpdatePassword, asyncError(teacher.putUpdatePassword))

module.exports = router