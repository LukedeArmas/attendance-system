const express = require('express')
const router = express.Router({ mergeParams: true })
const asyncError = require('../utils/asyncError.js')
const { validateAttendance, objectIdMiddleware, isLoggedIn, verifyTeacher } = require('../middleware.js')
const attendance = require('../controllers/attendance')


router.route('/')
    .get(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.home))
    .post(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(validateAttendance), asyncError(attendance.post))

router.route('/new')
    .get(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.new))

router.route('/:dateId')
    .get(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.show))
    .put(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.put))
    .delete(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.delete))
    
router.route('/:dateId/edit')
    .get(isLoggedIn, asyncError(verifyTeacher), objectIdMiddleware, asyncError(attendance.edit))


module.exports = router