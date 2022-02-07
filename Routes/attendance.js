const express = require('express')
const router = express.Router({ mergeParams: true })
const asyncError = require('../utils/asyncError.js')
const { validateAttendance, objectIdMiddleware, isLoggedIn, verifyTeacher } = require('../middleware.js')
const attendance = require('../controllers/attendance')


router.route('/')
    .get(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.home))
    .post(isLoggedIn, verifyTeacher, objectIdMiddleware, validateAttendance, asyncError(attendance.post))

router.route('/new')
    .get(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.new))

router.route('/:dateId')
    .get(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.show))
    .put(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.put))
    .delete(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.delete))
    
router.route('/:dateId/edit')
    .get(isLoggedIn, verifyTeacher, objectIdMiddleware, asyncError(attendance.edit))


module.exports = router